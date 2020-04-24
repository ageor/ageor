export default class Biome {
    biomeTag;
    initialCapital;
    baseBizCost;
    exponent;
    bizList;

    capital = 0;
    owned = 0;
    selectedBiz = 0;
    bizEntities = [];

    calculateCost() {
        return Math.floor(this.baseBizCost * Math.pow(this.exponent, this.owned));
    }
};
