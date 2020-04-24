import { err } from "../logger.js"

let hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
    if (document[hidden]) {
        saveGame();
    } else {
        loadGame();
    }
}

let _hardly;

async function loadGame() {
    // Swap this for a network call to store to a backend
    const saveData = localStorage.getItem("saveData");

    if (!saveData) return;

    const saveState = JSON.parse(saveData);

    deserializeGame(saveState);

    _hardly.emitEvent("event_loadGame", saveState.gameTime, Date.now() - saveState.saveTime);
}

async function saveGame() {
    let saveState = serializeGame();

    saveState.saveTime = Date.now();
    saveState.gameTime = _hardly.Time.now;

    // Swap this for a network call to store to a backend
    localStorage.setItem("saveData", JSON.stringify(saveState));
}

function serializeGame() {
    let biome, biomeName, biomeData, bizEntity, bizData, genEntity, generator;

    const saveState = {};

    for (biomeName in _hardly.Biomes) {
        biome = _hardly.Biomes[biomeName];

        saveState[biomeName] = biomeData = {
            capital: biome.capital,
            owned: biome.owned,
            businesses: {},
        };

        for (bizEntity of biome.bizEntities) {
            if (biomeData.businesses[bizEntity.meta.name]) {
                err(`Save: Business ${bizEntity.meta.name} already exists!`);
            }

            biomeData.businesses[bizEntity.meta.name] = bizData = {
                owned: bizEntity.Biz.owned,
                generators: {},
            }

            for (genEntity of bizEntity.Biz.genEntities) {
                if (bizData.generators[genEntity.meta.name]) {
                    err(`Save: Generator ${genEntity.meta.name} already exists!`);
                }

                generator = genEntity.Generator;

                bizData.generators[genEntity.meta.name] = {
                    owned: generator.owned,
                    managed: generator.managed,
                    running: generator.running,
                    startTime: generator.startTime,
                }
            }
        }
    }

    return saveState;
}

function deserializeGame(saveState) {
    let biome, biomeName, biomeData,
        businessEntity, businessName, businessData,
        genName, genData, genEntity;

    for (biomeName in _hardly.Biomes) {
        biome = _hardly.Biomes[biomeName];
        biomeData = saveState[biomeName];

        biome.capital = biome.preLoadCapital = biomeData.capital;
        biome.owned = biomeData.owned;

        for (businessName in biomeData.businesses) {
            businessData = biomeData.businesses[businessName];
            businessEntity = biome.bizEntities.find(b => b.meta.name == businessName);

            if (!businessEntity) continue;

            businessEntity.Biz.owned = businessData.owned;
            
            for (genName in businessData.generators) {
                genData = businessData.generators[genName];
                genEntity = businessEntity.Biz.genEntities.find(b => b.meta.name == genName);

                if (!genEntity) continue;

                genEntity.Generator.owned = genData.owned;
                genEntity.Generator.managed = genData.managed;
                genEntity.Generator.running = genData.running;
                genEntity.Generator.startTime = genData.startTime;
            }
        }
    }
}

function resetGame() {
    localStorage.removeItem("saveData");
    document.removeEventListener(visibilityChange, handleVisibilityChange);
    location.reload();
}

export default class SaveSystem {
    constructor(hardly) {
        _hardly = hardly;

        hardly.loadGame = loadGame;
        hardly.resetGame = resetGame;
    }

    init() {
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
};
