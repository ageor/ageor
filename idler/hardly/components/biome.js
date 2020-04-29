export default class Biome {
    constructor() {
        this.biomeTag;
        this.initialCapital;
        this.baseBizCost;
        this.exponent;
        this.bizList;
    
        this.capital = 0;
        this.owned = 0;
        this.selectedBiz = 0;
        this.bizEntities = [];
    }

    calculateCost() {
        return Math.floor(this.baseBizCost * Math.pow(this.exponent, this.owned));
    }
};
