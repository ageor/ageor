import BaseUISystem from "./base_ui_system.js"

let _hardly;

export default class GeneratorUISystem extends BaseUISystem {
    static entityQuery = ["Generator", "GeneratorDom"];

    constructor(hardly) {
        super(hardly);

        _hardly = hardly;
    }

    added(e) {
        const genDom = e.GeneratorDom;
        const gen = e.Generator;
        const dom = genDom.dom = genDom.render();
        const icon = this.div("image");
        const ownedLabel = this.div("owned");
        const info = this.div("info");
        const income = this.div("income");
        const buyButton = this.div("buy");
        const buyLabel = this.div("label");
        const buyCost = this.div("cost");

        dom.classList.add("unowned");
        dom.classList.add("expensive");
        buyLabel.innerText = _hardly.L10N["buy"];

        icon.appendChild(ownedLabel);
        dom.appendChild(icon);
        dom.appendChild(info);
        info.appendChild(income);
        info.appendChild(buyButton);
        buyButton.appendChild(buyCost);
        buyButton.appendChild(buyLabel);
        
        this.updateCash(info, gen);
        buyButton.onclick = () => {
            _hardly.emitEvent("event_capitalChange", gen.biomeTag, -gen.calculateCost());

            gen.owned = ownedLabel.innerText = gen.owned + 1;

            dom.classList.remove("unowned");

            this.updateCash(info, gen);
        }

        icon.onclick = function() {
            gen.start(_hardly.Time.now);
            dom.classList.add("generating");
        }

        _hardly.onEvent("event_capitalChange", function(tag) {
            if (tag != gen.biomeTag) return;

            if (_hardly.Biomes[tag].capital < gen.calculateCost()) {
                dom.classList.add("expensive");
            } else {
                dom.classList.remove("expensive");
            }
        });
    }

    updateCash(info, gen) {
        info.querySelector(".income").innerText = this.formatNumber(gen.calculateProduction());
        info.querySelector(".buy .cost").innerText = this.formatNumber(gen.calculateCost());
    }

    update() {
        let e, gen, genDom, dom;
        for (e of this.entities) {
            gen = e.Generator;
            genDom = e.GeneratorDom;
            dom = genDom.dom;
            
            if (!gen.running) {
                if (dom.classList.contains("generating")) {
                    dom.style.setProperty("--progress", "0%");
                    dom.classList.remove("generating");
                }

                continue;
            }

            dom.style.setProperty("--progress", `${gen.progress * 100}%`);
        }
    }
};
