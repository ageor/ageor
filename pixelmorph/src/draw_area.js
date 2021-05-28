import { morphTranslate } from '/src/canvas_morph.js';

const drawarea = document.querySelector('.drawarea');
const canvas = drawarea.querySelector('canvas');

let drag = false;
let dragStart = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };

function initDrag() {
    drawarea.onmousedown = (e) => {
        if (e.button !== 0) return;

        const { clientX, clientY } = e;

        drag = true;
        dragStart.x = clientX;
        dragStart.y = clientY;
    }

    window.addEventListener('mousemove', (e) => {
        if (drag) {
            const { clientX, clientY } = e;

            morphTranslate(clientX - dragStart.x, clientY - dragStart.y);

            dragStart.x = clientX;
            dragStart.y = clientY;            
        }
    });

    window.addEventListener('mouseup', (e) => {
        drag = false;
    });
}

export default initDrag;
