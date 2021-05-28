const CanvasMorph = {
    translate: {
        x: 0,
        y: 0,
    },
    scale: 8,
};

const canvas = document.querySelector(".drawarea canvas");

function morphCanvas() {
    const scale = `scale(${CanvasMorph.scale})`;
    const translate = `translate(${CanvasMorph.translate.x}px, ${CanvasMorph.translate.y}px)`
    canvas.style.transform = `${translate} ${scale}`;
}

function morphTranslate(x, y) {
    CanvasMorph.translate.x += x;
    CanvasMorph.translate.y += y;

    morphCanvas();
}

function morphScale(scale) {
    CanvasMorph.scale = scale;

    morphCanvas();
}

export { morphTranslate, morphScale };
