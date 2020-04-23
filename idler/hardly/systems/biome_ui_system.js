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
        const bizContainer = this.div("biz");
        const controls = this.div("controls");
        const overlay = this.div("overlay hidden");
        const managers = this.div("managers");
        const managerButton = this.div("button man");
        const runIdle = this.div("button run-idle");

        dom.appendChild(capitalLabel);
        dom.appendChild(bizContainer);
        dom.appendChild(controls);
        dom.appendChild(overlay);
        controls.appendChild(managerButton);
        controls.appendChild(runIdle);
        overlay.appendChild(managers);

        capitalLabel.innerText = this.formatNumber(biome.capital);
        
        this.renderManagers(biome, managers);

        runIdle.onclick = () => {
            if (!this.currentBiz(biome).owned) return;

            let gen, generatorEntities = this.currentBiz(biome).gen;

            for (gen of generatorEntities) {
                let generator = gen.Generator;

                if (generator.running || !generator.owned) continue;

                generator.start(_hardly.Time.now);
            }
        }

        managerButton.onclick = () => {
            let biz = this.currentBiz(biome);

            if (!biz.owned) return;

            overlay.classList.remove("hidden");
        }

        overlay.onclick = function() {
            overlay.classList.add("hidden");
        }

        _hardly.onEvent("event_capitalChange", (tag) => {
            if (tag != biome.biomeTag) return;

            capitalLabel.innerText = this.formatNumber(biome.capital);
        });
    }

    renderManagers(biome, dom) {
        let gen, generatorEntities = this.currentBiz(biome).gen;

        for (gen of generatorEntities) {
            let generator = gen.Generator;
            let button = this.div("manager-buy expensive");

            dom.appendChild(button);

            button.onclick = function(e) {
                if (generator.managed || generator.managerCost > biome.capital) return;

                this.classList.add("owned");

                generator.managed = true;
                generator.start(_hardly.Time.now);

                _hardly.emitEvent("event_capitalChange", generator.biomeTag, -generator.managerCost);
                
                _hardly.emitEvent("event_managerHire");

                
                e.stopPropagation();
            }

            _hardly.onEvent("event_capitalChange", function(tag) {
                if (generator.biomeTag != tag || generator.managed) return;

                button.classList.toggle("expensive", biome.capital < generator.managerCost);
            });
        }
    }

    currentBiz(biome) {
        return biome.biz[biome.selectedBiz].Biz;
    } 
};
