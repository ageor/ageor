const _biomes = [];
let _hardly;

export default class BiomeSystem {
    static entityQuery = ["Biome"];

    constructor(hardly) {
        hardly.Biomes = _biomes;
    }

    added(e) {
        e.Biome.prestiegePoints = 0;

        _biomes.push(e);
    }

    removed(e) {
        err(`BiomeSystem: Removed biome ${e.meta.name}`);
    }
};
