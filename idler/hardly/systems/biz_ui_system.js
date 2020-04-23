import BaseUISystem from "./base_ui_system.js";

let _hardly;

export default class BizUISystem extends BaseUISystem {
    static entityQuery = ["Biz", "BizDom"];

    constructor(hardly) {
        super(hardly);

        _hardly = hardly;
    }

    added(e) {
        const dom = e.BizDom.render();
        const biz = e.Biz;
        const biome = _hardly.Biomes[biz.biomeTag];
        const overlay = this.div("overlay");
        const buyButton = this.div("buy-button");
        const price = this.div();
        const label = this.div();

        buyButton.appendChild(price);
        buyButton.appendChild(label);
        overlay.appendChild(buyButton);
        dom.appendChild(overlay);
        
        label.innerText = _hardly.L10N["buy"];
        price.innerText = this.formatNumber(biome.calculateCost());

        buyButton.onclick = function() {
            biz.owned = true;

            overlay.classList.add("hidden");

            _hardly.emitEvent("event_capitalChange", biz.biomeTag, -biome.calculateCost());
        }
    }
};
