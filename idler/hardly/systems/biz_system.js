import { err } from "../logger.js"

const _query = ["Biz"];
let _hardly;

export default class BizSystem {
    static get entityQuery() { return _query; }

    constructor(hardly) {
        _hardly = hardly;
    }

    added(e) {
        let gen, biz = e.Biz;

        for (gen of biz.generators) {
            biz.genEntities.push(_hardly.load(gen));
        }
    }

    removed(e) {
        err(`BizSystem: Removed biz ${e.meta.name}`);
    }
};
