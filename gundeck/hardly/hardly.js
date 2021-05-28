import { log, err } from "./logger.js"
import { ECS, registerComponent } from "./ecs.js";
import { Assets } from "./data.js";
import * as Components from "./component_imports.js";
import * as Systems from "./system_imports.js";
import * as Importers from "./importer_imports.js";
import _prototypeData from "./prototypes_build.js";

const _protoPrefix = "hardly/prototype/";
const _assetsPrefix = "hardly/assets/";

const _ecs = new ECS();
const _debug = true;

const _systems = {};
const _importers = [];

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

        log(`Registered ${system}`);
    }
    
    log(`System import done in ${new Date() - sysImportStart}ms`);
}

class Hardly {
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

import HardlyConfig from "./config.js";

export default async function init() {
    const hardly = new Hardly();

    if (HardlyConfig.debug) {
        window.dbg = hardly;
    }

    await hardly.init();

    for (let system of HardlyConfig.systemLoad) {
        hardly.addSystem(system.name, system.order);
    }

    hardly.initSystems();

    for (let proto of HardlyConfig.protoLoad) {
        hardly.load(proto);
    }

    hardly.update();
    
    function update() {
        hardly.update();

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}
