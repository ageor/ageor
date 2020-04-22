export default class BiomeUISystem {
    static entityQuery = ["Biome", "BiomeDom"];

    added(e) {
        e.BiomeDom.render();
    }
};
