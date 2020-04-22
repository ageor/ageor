let _hardly;

export default class BizUISystem {
    static entityQuery = ["Biz", "BizDom"];

    constructor(hardly) {
        _hardly = hardly;
    }

    added(e) {
        const dom = e.BizDom.render();
        const header = document.createElement("DIV");
        const generatorList = document.createElement("DIV");

        header.classList.add("biz-name");
        header.innerText = _hardly.L10N[e.BizDom.bizNameKey];
        dom.appendChild(header);

        generatorList.classList.add("generators");
        dom.appendChild(generatorList);
    }
};
