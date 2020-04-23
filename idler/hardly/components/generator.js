export default class Generator {
    biomeTag;
    baseCost;
    exponent;
    baseRevenue;
    baseCycle;

    calculateCost() {
        return Math.floor(this.baseCost * Math.pow(this.exponent, this.owned));
    }

    calculateProduction() {
        return this.baseRevenue * this.owned;
    }

    start(startTime) {
        this.running = true;
        this.progress = 0;
        this.startTime = startTime;
    }
};
