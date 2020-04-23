export default class Generator {
    biomeTag;
    baseCost;
    exponent;
    baseRevenue;
    baseCycle;
    managerCost;

    calculateCost() {
        return Math.floor(this.baseCost * Math.pow(this.exponent, this.owned));
    }

    calculateProduction() {
        return this.baseRevenue * this.owned;
    }

    start(startTime) {
        if (this.running) return;

        this.running = true;
        this.progress = 0;
        this.startTime = startTime;
    }
};
