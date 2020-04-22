let _hardly;

export default class GeneratorUISystem {
    static entityQuery = ["Generator", "GeneratorDom"];

    constructor(hardly) {
        _hardly = hardly;
    }

    added(e) {
        let dom = e.GeneratorDom.render();
        
        dom.innerText = this.updateUI(e.Generator);
        dom.onclick = () => {
            e.Generator.owned += 1;
            dom.innerText = this.updateUI(e.Generator);
        }
    }

    updateUI(gen) {
        return `${gen.calculateCost()} ${gen.calculateProduction()}`
    }
};
