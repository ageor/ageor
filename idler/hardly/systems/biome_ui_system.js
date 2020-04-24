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
        const passiveGain = this.div("passive-gain hidden");
        const managerButton = this.div("button man");
        const rotateBiz = this.div("button rotate");
        const runIdle = this.div("button run-idle");

        dom.appendChild(capitalLabel);
        dom.appendChild(bizContainer);
        dom.appendChild(controls);
        dom.appendChild(overlay);
        controls.appendChild(managerButton);
        controls.appendChild(rotateBiz);
        controls.appendChild(runIdle);
        overlay.appendChild(managers);
        overlay.appendChild(passiveGain);

        capitalLabel.innerText = this.formatNumber(biome.capital);
        
        this.renderManagers(biome, managers);

        rotateBiz.onclick = function() {
            biome.selectedBiz = (biome.selectedBiz + 1) % biome.bizEntities.length;

            _hardly.emitEvent("event_rotateBiz", biome.selectedBiz);
        }

        runIdle.onclick = () => {
            if (!this.currentBiz(biome).owned) return;

            let gen, generatorEntities = this.currentBiz(biome).genEntities;

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
            managers.classList.remove("hidden");
            passiveGain.classList.add("hidden");
        }

        _hardly.onEvent("event_capitalChange", (tag) => {
            if (tag != biome.biomeTag) return;

            capitalLabel.innerText = this.formatNumber(biome.capital);
        });

        _hardly.onEvent("event_loadGame", () => {
            capitalLabel.innerText = this.formatNumber(biome.capital);

            const gain = biome.capital - biome.preLoadCapital;

            if (!gain) return;

            managers.classList.add("hidden");
            passiveGain.classList.remove("hidden");
            passiveGain.innerHTML = _hardly.L10N["passiveGainHTML"] + this.formatNumber(gain);
            overlay.classList.remove("hidden");
        });
    }

    renderManagers(biome, dom) {
        const overlayClose = this.div("close");
        const title = this.div("title");
        const description = this.div("description");
        const managerList = this.div("list");
        let biz;

        title.innerText = _hardly.L10N["managers_title"];
        description.innerText = _hardly.L10N["managers_desc"];
        overlayClose.innerText = "X";

        dom.appendChild(title);
        dom.appendChild(description);
        dom.appendChild(managerList);

        managerList.onclick = (e) => e.stopPropagation();

        for (biz of biome.bizEntities) {
            this.renderBiz(biome, biz, managerList);
        }

        dom.appendChild(overlayClose)
    }

    renderBiz(biome, biz, dom) {
        const name = this.div("biz-name");
        let gen, generatorEntities = biz.Biz.genEntities;

        name.innerText = _hardly.L10N[biz.BizDom.bizNameKey];

        dom.appendChild(name);

        for (gen of generatorEntities) {
            let generator = gen.Generator;
            
            this.renderManager(biome, generator, biz.Biz, dom);
        }
    }

    renderManager(biome, generator, biz, dom) {
        let button = this.div("manager-buy expensive");

        dom.appendChild(button);

        button.innerText = this.formatNumber(generator.managerCost);

        button.onclick = function(e) {
            if (generator.managed || !generator.owned || generator.managerCost > biome.capital) return;

            this.classList.add("owned");

            generator.managed = true;
            generator.start(_hardly.Time.now);

            _hardly.emitEvent("event_capitalChange", generator.biomeTag, -generator.managerCost);
            
            _hardly.emitEvent("event_managerHire");

            e.stopPropagation();
        }

        _hardly.onEvent("event_capitalChange", function(tag) {
            if (generator.biomeTag != tag || generator.managed || !generator.owned) return;

            button.classList.toggle("expensive", biome.capital < generator.managerCost);
        });

        _hardly.onEvent("event_loadGame", function() {
            button.classList.toggle("owned", generator.managed);

            if (generator.managed || generator.owned) {
                button.classList.remove("expensive");    
            } else if (biz.owned) {
                button.classList.toggle("expensive", biome.capital < generator.managerCost);
            }
        });
    }

    currentBiz(biome) {
        return biome.bizEntities[biome.selectedBiz].Biz;
    } 
};
