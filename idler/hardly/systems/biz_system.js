import { err } from "../logger.js"

let _hardly;

export default class BizSystem {
    static entityQuery = ["Biz"];

    constructor(hardly) {
        _hardly = hardly;
    }

    added(e) {
        let gen, biz = e.Biz;
        biz.gen = [];
        biz.owned = false;

        for (gen of biz.generators) {
            biz.gen.push(_hardly.load(gen));
        }
    }

    removed(e) {
        err(`BizSystem: Removed biz ${e.meta.name}`);
    }
};