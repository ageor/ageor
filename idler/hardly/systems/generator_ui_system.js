import BaseUiSystem from "./base_ui_system.js"

const _query = ["Generator", "GeneratorDom"];
let _hardly;

export default class GeneratorUiSystem extends BaseUiSystem {
    static get entityQuery() { return _query; }

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
        
        icon.classList.add(genDom.nameKey);

        icon.appendChild(ownedLabel);
        dom.appendChild(icon);
        dom.appendChild(info);
        info.appendChild(income);
        info.appendChild(buyButton);
        buyButton.appendChild(buyCost);
        buyButton.appendChild(buyLabel);

        this.updateCash(info, gen);
        buyButton.onclick = () => {
            gen.owned = ownedLabel.innerText = gen.owned + 1;

            _hardly.emitEvent("event_capitalChange", gen.biomeTag, -gen.calculateCost());

            gsap.timeline({ defaults: { duration: 0.1 }})
                .to(buyButton, { scale: 1.02, ease: "power2.out" })
                .to(buyButton, { scale: 1, ease: "power2.in" })

            dom.classList.remove("unowned");

            this.updateCash(info, gen);
        }

        icon.onclick = function() {
            gen.start(_hardly.Time.now);
        }

        _hardly.onEvent("event_capitalChange", function(tag) {
            if (tag != gen.biomeTag) return;

            dom.classList.toggle("expensive", _hardly.Biomes[tag].capital < gen.calculateCost());
        });

        _hardly.onEvent("event_managerHire", function() {
            dom.classList.toggle("generating", gen.managed || gen.running);
            dom.classList.toggle("managed", gen.managed);
        });

        _hardly.onEvent("event_loadGame", () => {
            dom.classList.toggle("generating", gen.managed || gen.running);
            dom.classList.toggle("managed", gen.managed);
            dom.classList.toggle("expensive", _hardly.Biomes[gen.biomeTag].capital < gen.calculateCost());
            dom.classList.toggle("unowned", !gen.owned);
            dom.style.setProperty("--progress", `${gen.progress * 100}%`);
            ownedLabel.innerText = gen.owned;
            this.updateCash(info, gen);
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
            } else if (!dom.classList.contains("generating")) {
                dom.classList.add("generating");
            }

            dom.style.setProperty("--progress", `${gen.progress * 100}%`);
        }
    }
};
