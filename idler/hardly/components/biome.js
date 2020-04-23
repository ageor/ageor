export default class Biome {
    biomeTag;
    initialCapital;
    baseBizCost;
    exponent;
    bizList;

    calculateCost() {
        return Math.floor(this.baseBizCost * Math.pow(this.exponent, this.owned));
    }
};
