export default class BaseDOM {
    constructor() {
        this.selector;
        this.klass;
    }

    render() {
        let parent = document.querySelector(this.selector);
        let dom = document.createElement("DIV");

        dom.setAttribute("class", this.klass);
        parent.appendChild(dom);

        return dom;
    }
};
