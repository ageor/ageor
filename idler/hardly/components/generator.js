export default class Generator {
    baseCost;
    exponent;
    baseRevenue;
    baseCycle;

    calculateCost() {
        return Math.round(this.baseCost * Math.pow(this.exponent, this.owned));
    }

    calculateProduction() {
        return this.baseRevenue * this.owned;
    }
};
