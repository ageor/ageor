import { log, err } from "./logger.js"
import { ECS, registerComponent } from "./ecs.js";
import { Components, Systems, Prototypes, Assets, Importers } from "./data.js";

// Components and Systems are imports and need ./ prefixed
const _componentsPrefix = "./components/";
const _systemsPrefix = "./systems/";
const _protoPrefix = "prototype/";
const _assetsPrefix = "assets/";

const _ecs = new ECS();
const _debug = true;

const _systems = {};
const _importers = [];

let _prototypeData = {};
let _assetsData = {};

async function importComponents() {
    log("Component import start...");

    const compImportStart = new Date();
    let component, promises = [];

    for (component of Components) {
        promises.push(import(_componentsPrefix + component));
    }

    await Promise.all(promises).then(function(componentImports) {
        let comp;
        for (comp of componentImports) {
            registerComponent(comp.default);
        }
    });
    
    log(`Component import done in ${new Date() - compImportStart}ms`);
}

async function downloadPrototypes() {
    log("Prototype download start...");

    const dlStart = new Date();
    let proto, promises = [];
    
    for (proto of Prototypes) {
        log(`Downloading ${proto}`);

        promises.push(fetch(_protoPrefix + proto)
            .then(response => response.json())
            .then(data => _prototypeData[proto.substr(0, proto.length - 5)] = data)
            .catch(err));
    }

    await Promise.all(promises);

    log(`Prototype download done in ${new Date() - dlStart}ms`);
}

async function downloadAssets() {
    log("Asset download start...");

    const dlStart = new Date();

    let importer, assetPath, asset, i, promises = [];
    
    for (asset of Assets) {
        log(`Downloading asset ${asset}`);

        importer = null;
        assetPath = _assetsPrefix + asset;

        for (i of _importers) {
            if (!i.match(assetPath)) continue;

            importer = i;

            break;
        }

        if (importer) {
            promises.push(importer.promise(assetPath)
                .then(data => _assetsData[asset] = data)
                .catch(err));
        } else {
            promises.push(fetch(assetPath)
                .then(response => response.text())
                .then(data => _assetsData[asset] = data)
                .catch(err));
        }
    }

    await Promise.all(promises);

    log(`Asset download done in ${new Date() - dlStart}ms`);
}

async function importSystems() {
    log("System import start...");
    
    const sysImportStart = new Date();
    let system, promises = [];
    
    for (system of Systems) {
        promises.push(import(_systemsPrefix + system));
    }

    await Promise.all(promises).then(function(systemImports) {
        let sys, sysClass;
        for (sys of systemImports) {
            sysClass = sys.default;

            _systems[sysClass.name.substr(0, sysClass.name.length - 6)] = sysClass;

            log(`Registered ${sysClass.name}`);
        }
    });
    
    log(`System import done in ${new Date() - sysImportStart}ms`);
}

export default class Hardly {
    constructor() {
        if (!_debug) return;

        this.ECS = _ecs;
        this.Importers = _importers;
    }

    async init() {
        log("Init start...");

        const initStart = new Date();
        let importer, i;

        for (importer of Importers) {
            i = await import('./' + importer);
            _importers.push(i.default);
        }

        await Promise.all([
            importComponents(),
            importSystems(),
            downloadPrototypes(),
            downloadAssets(),
        ]);

        log(`Init done in ${new Date() - initStart}ms`);
    }

    addSystem(systemName, priority) {
        _ecs.addSystem(new _systems[systemName](this), priority);
    }

    update() {
        _ecs.update();
    }

    initSystems() {
        _ecs.init();
    }

    load(prototypeName) {
        if (!_prototypeData[prototypeName]) {
            err(`Prototype ${prototypeName} not found!`);
            return;
        }

        let objectData = _prototypeData[prototypeName];
        let entity = this.ecs.createEntity(Object.keys(objectData.components), objectData.name);

        let componentName, componentData, component, property;

        for (componentName in objectData.components) {
            componentData = objectData.components[componentName];
            component = entity[componentName];

            for (property in componentData) {
                component[property] = componentData[property];
            }
        }

        return entity;
    }
};
