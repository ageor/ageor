const _biomes = [];
let _hardly;

export default class BiomeSystem {
    static entityQuery = ["Biome"];

    constructor(hardly) {
        _hardly = hardly;
        hardly.Biomes = _biomes;
    }

    added(e) {
        let biz, biome = e.Biome;

        biome.prestiege = 0;
        biome.capital = biome.initialCapital;

        _biomes.push(e);

        biome.biz = [];

        for (biz of biome.bizList) {
            biome.biz.push(_hardly.load(biz));
        }
    }

    removed(e) {
        err(`BiomeSystem: Removed biome ${e.meta.name}`);
    }
};
