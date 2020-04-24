export default class Generator {
    biomeTag;
    baseCost;
    exponent;
    baseRevenue;
    baseCycle;
    managerCost;

    owned = 0;
    managed = false;
    progress = 0;
    running = false;
    startTime = 0;

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

    forward(from, delta, now) {
        // If the generator is managed, it will be running
        if (!this.running) return 0;

        const originalDelta = from + delta - this.startTime;
        const cycleMS = this.baseCycle * 1000;
        const cyclesPassed = (originalDelta / cycleMS) | 0;
        const cycleProduction = this.calculateProduction();
        const leftOver = originalDelta - cyclesPassed * cycleMS;

        // Unmanaged generators can only finish generating
        if (!this.managed && cyclesPassed) {
            this.running = false;
            this.progress = 0;

            return cycleProduction;
        }

        this.startTime = now - leftOver;

        return cycleProduction * cyclesPassed;
    }
};
