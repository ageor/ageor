class Color {
    constructor(h = 0, s = 0, l = 0) {
        this.h = h;
        this.s = s;
        this.l = l;
    }

    get bgcol() {
        return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    }

    static lerp(a, b, p) {
        return new Color(
            b.h * p + a.h * (1 - p),
            b.s * p + a.s * (1 - p),
            b.l * p + a.l * (1 - p)
        );
    }
};

const GridItemMode = {
    EMPTY: 0,
    MANUAL: 1,
    AUTO: 2,
};

class GridItem {
    constructor() {
        this.mode = GridItemMode.EMPTY;
        this.el = null;
        this.color = null;
    }
};

const palette = document.querySelector(".palette");
const gridSize = 9;
let grid = new Array(gridSize * gridSize);

function initGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        grid[i] = new GridItem();
    }
}

function setColor(x, y, col, mode) {
    const i = x + y * gridSize;
    const gridI = grid[i];
    gridI.color = col;
    gridI.el.style.backgroundColor = col.bgcol;

    if (mode === GridItemMode.AUTO) {
        gridI.mode = GridItemMode.AUTO;
        gridI.el.classList.toggle("auto", true);
        gridI.el.classList.toggle("manual", false);
        return;
    } else {
        gridI.mode = GridItemMode.MANUAL;
        gridI.el.classList.toggle("auto", false);
        gridI.el.classList.toggle("manual", true);
    }

    const end = (1 + (i / gridSize) | 0) * gridSize;
    let lerpEnd = -1;

    for (let j = x + y * gridSize + 1; j < end; j++) {
        if (grid[j].mode === GridItemMode.MANUAL) {
            lerpEnd = j;
            break;
        }
    }

    if (lerpEnd > 0) {
        const step = 1 / (lerpEnd - x);
        for (let j = x + 1; j < lerpEnd; j++) {
            setColor(
                j,
                y,
                Color.lerp(
                    gridI.color,
                    grid[lerpEnd].color,
                    step * (j - x)
                ),
                GridItemMode.AUTO
            );
        }
    }

    const start = ((i / gridSize) | 0) * gridSize;
    let lerpStart = -1;

    for (let j = x + y * gridSize - 1; j >= start; j--) {
        if (grid[j].mode === GridItemMode.MANUAL) {
            lerpStart = j;
            break;
        }
    }

    if (lerpStart >= 0) {
        const step = 1 / (lerpStart - x);
        for (let j = x - 1; j > lerpStart; j--) {
            setColor(
                j,
                y,
                Color.lerp(
                    gridI.color,
                    grid[lerpStart].color,
                    step * (j - x)
                ),
                GridItemMode.AUTO
            );
        }
    }
}

function initPalette() {
    initGrid();

    palette.style.gridTemplate = `repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const col = document.createElement("div");
        col.classList.add("col");
        col.oncontextmenu = function() {
            console.log("twerks");
            return false;
        }

        const btn = document.createElement("div");
        btn.classList.add("button");

        grid[i].el = btn;

        col.appendChild(btn);
        palette.appendChild(col);
    }

    // setColor(8, 0, new Color(220, 100, 50));
    setColor(0, 0, new Color(220, 0, 100));
    setColor(4, 0, new Color(220, 0, 0));
}

export default initPalette;
