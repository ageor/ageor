import { err } from "../logger.js"

const _query = ["Biome"];
const _biomes = {};
let _hardly;

export default class BiomeSystem {
    static get entityQuery() { return _query; }

    constructor(hardly) {
        _hardly = hardly;
        hardly.Biomes = _biomes;
    }

    added(e) {
        let biz, i, bizEntity, biome = e.Biome;

        biome.capital = biome.initialCapital;

        if (_biomes[biome.biomeTag]) {
            err(`BiomeSystem: biome with tag ${biome.biomeTag} already exists`);
        }

        _biomes[biome.biomeTag] = biome;

        _hardly.onEvent("event_capitalChange", function(tag, delta) {
            if (tag != biome.biomeTag) return;

            biome.capital = Math.max(biome.capital + delta, 0);
        });

        for (i = 0; i < biome.bizList.length; i++) {
            biz = biome.bizList[i];
            bizEntity = _hardly.load(biz);
            bizEntity.Biz.idx = i;

            biome.bizEntities.push(bizEntity);
        }
    }

    removed(e) {
        err(`BiomeSystem: Removed biome ${e.meta.name}`);
    }
};
