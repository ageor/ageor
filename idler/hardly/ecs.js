import { log, warn, err } from "./logger.js"

// Utility
class SortedArray extends Array {
    constructor(sortFunction, size = 0) {
        super(size);
        this._sort = sortFunction
    }

    add(item) {
        let saveIdx = this._sort(this, item);

        if (saveIdx == -1) {
            this.push(item);
        } else {
            this.push(null);

            let x;
            for (x = this.length - 1; x > saveIdx; x--) {
                this[x] = this[x-1];
            }

            this[saveIdx] = item;
        }

        return this;
    }
}

function system_idx(arr, item) {
    let s, i = -1, saveIdx = -1;
    
    for (s of arr) {
        i++;
        
        if (s.priority < item.priority) continue;
        if (s.priority == item.priority && s.order < item.order) continue;
        
        saveIdx = i;
        
        break;
    }

    return saveIdx;
}

// Components
const _comCache = new Map();

function destroyComponent(c) { 
    c.recycled = true;
}

// Register a component by passing the constructor
function registerComponent(com) {
    if (_comCache.has(com.name)) {
        err(`registerComponent: component ${com.name} already exist`);

        return;
    }

    com.prototype.recycled = false;

    _comCache.set(com.name, {
        object: com,
        cache: new Array(),
    });

    log(`registerComponent: registered component ${com.name}`);
}

// Create a registered component by its name
function createComponent(comName) {
    let comInfo = _comCache.get(comName);
    if (!comInfo) {
        err(`createComponent: component not found ${comName}`);
        
        return null;
    }

    let c, i;
    for (i = 0; i < comInfo.cache.length; i++) {
        if (comInfo.cache[i].recycled) {
            log(`createComponent: recycle component ${comName}`);

            c = comInfo.cache[i];
            c.recycled = false;

            break;
        }
    }

    if (!c) {
        comInfo.cache.push(c = new comInfo.object());
    }

    return c;
}


// Entity
class Entity {
    constructor(name = "") {
        this.meta = {
            name: name,
            active: true,
            recycled: false,
            tag: null,
        };
    }

    destroy() {
        this.meta.active = false;
        // TODO: block during spawn phase

        for (let c in this) {
            if (c == "meta" || c == "ecs") continue;

            this.ecs.flushQuery(c);
        }
    }

    ///////////////////////////////////////////////
    // COMPONENTS
    ///////////////////////////////////////////////

    // Add component instance
    static addComponent(e, c) {
        if (!e.ecs) {
            err("Entity.addComponent: component not added to an ECS.");
        }

        e[c.constructor.name] = c;

        e.ecs.flushQuery(c.constructor.name);
        
        return this;
    }

    // Create a component by component name and add it
    static addComponentFromList(e, arr) {
        let i, c;
        for (i of arr) {
            if (c = createComponent(i)) {
                Entity.addComponent(e, c);
            }
        }
        
        return Entity;
    }

    static removeComponent(e, name) {
        if (e[name]) {
            destroyComponent(e[name]);

            delete e[name];

            log(`Entity.removeComponent: ${name} in ${e.meta.name}`);
        } else {
            warn(`Entity.removeComponent: component not found: ${name}`);
        }
        
        return Entity;
    }


    //////////////////////////////////////////////
    // Object Handling
    //////////////////////////////////////////////
    static dispose(e) {
        let c;
        
        log(`Entity.dispose: ${e.meta.name} (${e.meta.id})`);
        
        for (c in e) {
            if (c == "meta" || c == "ecs") continue;

            Entity.removeComponent(e, c);
        }

        delete e.ecs;
    }
}

// Query
// Handles changes in queried entities
class Query {
    constructor() {
        this.dirty = true; // Whether there has been a change
        this.old = new Array(); // The list before the change
        this.results = new Array(); // The list after the change
        this.added = new Array(); // The new entities
        this.removed = new Array(); // The removed entities
        this.systems = new Array(); // The systems that use this query
        this.comList = null; // The components to be matched
    }

    update(data) {
        let i, s;

        this.old.length = 0;
        this.removed.length = 0;

        for (i = 0; i < this.results.length; i++) {
            this.old.push(this.results[i]);

            if (data.includes(this.results[i])) continue;

            this.removed.push(this.results[i]);
        }

        this.results.length = 0;
        this.added.length = 0;

        for (i = 0; i < data.length; i++) {
            this.results.push(data[i]);

            if (this.old.includes(data[i])) continue;

            this.added.push(data[i]);
        }

        for (s of this.systems) {
            if (this.added.length > 0) for (let e of this.added) s.system.added(e);
            if (this.removed.length > 0) for (let e of this.removed) s.system.removed(e);
        }

        this.dirty = false;
    }
}

// ECS
let _systemCount = 0; // Used to create an Order ID for Systems when added to an ECS
let _entityCount = 0;
const _queryOutCache = new Array();

class ECS {
    constructor() {
        this.entities = new Array();
        this.systems = new SortedArray(system_idx);
        this.queryCache = new Map();
    }

    //////////////////////////////////////////////////////
    // ENTITIES
    //////////////////////////////////////////////////////
    
    // Create a new Entity and add to the list
    createEntity(comList = null, eName = null) {
        let i, e;

        if (!eName) eName = `Entity ${_entityCount++}`;

        for (i = 0; i < this.entities.length; i++) {
            if (this.entities[i].meta.recycled) {
                log(`ECS.createEntity: recycle entity ${this.entities[i].meta.id}`);

                e = this.entities[i];
                e.meta.recycled = false;
                e.meta.name = eName;
                e.meta.active = true;
                e.meta.id = _entityCount;
                
                break;
            }
        }

        if (!e) this.entities.push(e = new Entity(eName));

        e.ecs = this;

        if (comList) {
            Entity.addComponentFromList(e, comList);
        }

        return e;
    }

    findEntity(eName) {
        let e;
        for (e of this.entities) if (e.meta.name == eName) return e;
        
        return null;
    }

    // Find all of the disabled entities and recycle them to the cache
    recycleInactiveEntities() {
        let e;
        for (e of this.entities) {
            if (!e.meta.active && !e.meta.recycled) {
                e.meta.recycled = true;
        
                Entity.dispose(e);
            }
        }
    }

    //////////////////////////////////////////////////////
    // SYSTEMS
    //////////////////////////////////////////////////////
    addSystem(sys, priority = 50) {
        const comList = sys.constructor.entityQuery;
        const queryName = comList ? "query~|" + comList.join("|") : "";

        this.systems.add({
            system: sys,
            order: ++_systemCount,
            name: sys.constructor.name,
            query: comList,
            queryName: queryName,
            priority,
        });

        return this;
    }

    // Initialize all systems
    init() {
        let s, q;
        for (s of this.systems) {
            if (s.query) {
                q = this.getQuery(s.queryName);
                q.comList = s.query;
                q.systems.push(s);

                s.system.entities = q.results;
            }

            if (s.system.init) {
                s.system.init();
            }
        }

        this.updateQueries();
        this.recycleInactiveEntities();
    }

    // Update all systems
    update() {
        let s;
        for (s of this.systems) {
            if (s.system.init) {
                s.system.update();
            }
        }

        this.updateQueries();
        this.recycleInactiveEntities();
    }

    removeSystem(sName) {
        let i;
        for (i = 0; i < this.systems.length; i++) {
            if (this.systems[i].name == sName) {
                this.systems.splice(i, 1);

                log(`ECS.removeSystem: removing System : ${sName}`);

                break;
            }
        }
    }

    //////////////////////////////////////////////////////
    // QUERIES
    //////////////////////////////////////////////////////

    getQuery(queryName) {
        let out = this.queryCache.get(queryName);

        if (!out) {
            out = new Query();

            this.queryCache.set(queryName, out);
        }

        return out;
    }

    updateQueries() {
        let queryName, q, keys = this.queryCache.keys();

        for (queryName of keys) {
            q = this.queryCache.get(queryName);

            if (!q.dirty) continue;

            q.update(this.queryEntities(q.comList));
        }
    }

    // Just indicates that the query needs to be updated,
    // because a query can be invalidated multiple times within the same frame
    flushQuery(comName) {
        let query, keys = this.queryCache.keys();

        for (query of keys) {
            if (query.indexOf ("|" + comName) > -1) {
                this.queryCache.get(query).dirty = true;
                log(`ECS.flushQuery: flush cache ${query}`);
            }
        }
    }

    queryEntities(comList) {
        let cLen = comList.length,
            cFind = 0,
            e, c;

        _queryOutCache.length = 0;

        for (e of this.entities) {
            if (!e.meta.active) continue;

            cFind = 0;

            for (c of comList) {
                if (!e[c]) break;
                else cFind++;
            }

            if (cFind == cLen) _queryOutCache.push(e);
        }

        return _queryOutCache;
    }
}

///////////////////////////////////////////////////////////////////////////////////
export { registerComponent, ECS };
