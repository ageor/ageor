import { err } from "../logger.js"

const _biomes = {};
let _hardly;

export default class BiomeSystem {
    static entityQuery = ["Biome"];

    constructor(hardly) {
        _hardly = hardly;
        hardly.Biomes = _biomes;
    }

    added(e) {
        let biz, i, bizEntity, biome = e.Biome;

        biome.prestiege = 0;
        biome.owned = 0;
        biome.capital = biome.initialCapital;
        biome.selectedBiz = 0;

        if (_biomes[biome.biomeTag]) {
            err(`BiomeSystem: biome with tag ${biome.biomeTag} already exists`);
        }

        _biomes[biome.biomeTag] = biome;

        biome.biz = [];

        _hardly.onEvent("event_capitalChange", function(tag, delta) {
            if (tag != biome.biomeTag) return;

            // if (delta > 0) delta *= 1000;

            biome.capital = Math.max(biome.capital + delta, 0);
        });

        for (i = 0; i < biome.bizList.length; i++) {
            biz = biome.bizList[i];
            bizEntity = _hardly.load(biz);
            bizEntity.Biz.idx = i;

            biome.biz.push(bizEntity);
        }
    }

    removed(e) {
        err(`BiomeSystem: Removed biome ${e.meta.name}`);
    }
};
