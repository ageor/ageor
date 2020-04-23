let _hardly;
const _scaleKeys = ["million", "billion", "trillion", "quadrillion"]
const _step = 1000;
const _threshold = 1000000;

export default class BaseUISystem {
    constructor(hardly) {
        _hardly = hardly;
    }

    formatNumber(num) {
        let currentScale = 0;

        if (num < _threshold) return num;

        num /= _threshold;

        while (num > _step) {
            num /= _step;

            currentScale++;
        }

        return `${num.toFixed(2)} ${_hardly.L10N[_scaleKeys[currentScale]]}`;
    }

    div(classes = "") {
        let div = document.createElement("DIV");

        div.setAttribute("class", classes);

        return div;
    }
};
