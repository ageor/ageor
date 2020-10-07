import { log, err } from "./logger.js"
import { ECS, registerComponent } from "./ecs.js";
import { Prototypes, Assets } from "./data.js";
import * as Components from "./component_imports.js";
import * as Systems from "./system_imports.js";
import * as Importers from "./importer_imports.js";

const _protoPrefix = "hardly/prototype/";
const _assetsPrefix = "hardly/assets/";

const _ecs = new ECS();
const _debug = true;

const _systems = {};
const _importers = [];

let _prototypeData = {};
let _assetsData = {};

async function importComponents() {
    log("Component import start...");

    const compImportStart = new Date();
    const componentNames = Object.keys(Components);
    let component;

    for (component of componentNames) {
        registerComponent(Components[component]);
    }
    
    log(`Component import done in ${new Date() - compImportStart}ms`);
}

async function downloadPrototypes() {
    log("Prototype download start...");

    const dlStart = new Date();
    let proto, promises = [];
    
    for (proto of Prototypes) {
        log(`Downloading ${proto}`);
        const name = proto;

        promises.push(fetch(_protoPrefix + proto)
            .then(response => response.json())
            .then(data => ({
                name: name.substr(0, name.length - 5),
                data: data
            }))
            .catch(err));
    }

    await Promise.all(promises).then(prototypes => {
        for (proto of prototypes) {
            _prototypeData[proto.name] = proto.data;
        }
    });

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
                .then(data => ({ name: asset, data: data }))
                .catch(err));
        } else {
            promises.push(fetch(assetPath)
                .then(response => response.text())
                .then(data => ({ name: asset, data: data }))
                .catch(err));
        }
    }

    await Promise.all(promises).then(assets => {
        for (proto of assets) {
            _assetsData[proto.name] = proto.data;
        }
    });


    log(`Asset download done in ${new Date() - dlStart}ms`);
}

async function importSystems() {
    log("System import start...");
    
    const sysImportStart = new Date();
    const systemNames = Object.keys(Systems);
    let system;

    for (system of systemNames) {
        _systems[system.substr(0, system.length - 6)] = Systems[system];
    }
    
    log(`System import done in ${new Date() - sysImportStart}ms`);
}

export default class Hardly {
    constructor() {
        if (!_debug) return;

        this.ECS = _ecs;
        this.Importers = _importers;
        this.PrototypeData = _prototypeData;
    }

    async init() {
        log("Init start...");

        const initStart = new Date();
        const importerNames = Object.keys(Importers);
        let importer;

        for (importer of importerNames) {
            _importers.push(Importers[importer]);
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
        let entity = _ecs.createEntity(Object.keys(objectData.components), objectData.name);

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
