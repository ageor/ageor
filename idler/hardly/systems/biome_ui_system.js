import BaseUISystem from "./base_ui_system.js"

let _hardly;

export default class BiomeUISystem extends BaseUISystem {
    static entityQuery = ["Biome", "BiomeDom"];

    constructor(hardly) {
        super(hardly);

        _hardly = hardly;
    }

    added(e) {
        const dom = e.BiomeDom.render();
        const biome = e.Biome;
        const capitalLabel = this.div("capital");

        dom.appendChild(capitalLabel);

        capitalLabel.innerText = this.formatNumber(biome.capital);

        _hardly.onEvent("event_capitalChange", (tag) => {
            if (tag != biome.biomeTag) return;

            capitalLabel.innerText = this.formatNumber(biome.capital);
        });
    }
};
