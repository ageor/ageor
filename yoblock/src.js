let scaling = window.devicePixelRatio;
let gridSize = 9;

while (50 * scaling * 12 > window.innerWidth - 40) {
    scaling -= 0.1;
}

let cellSize = 50 * scaling;
let padding = 30 * scaling;

let svg = null;
let cells = null;

let score = 0;

const t = d3.transition()
    .duration(300);

const elements = [
    // I
    [
        [1],
        [1],
        [1],
        [1],
    ],
    [
        [1, 1, 1, 1],
    ],

    // L
    [
        [1, 1],
        [0, 1],
        [0, 1],
    ],
    [
        [1, 1],
        [1, 0],
        [1, 0],
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1],
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1],
    ],
    [
        [1, 1, 1],
        [0, 0, 1],
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
    ],

    // T
    [
        [1, 1, 1],
        [0, 1, 0],
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
    ],
    [
        [1, 0],
        [1, 1],
        [1, 0],
    ],
    [
        [0, 1],
        [1, 1],
        [0, 1],
    ],

    // G
    [
        [1, 1, 0],
        [0, 1, 1],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
    [
        [0, 1],
        [1, 1],
        [1, 0],
    ],
    [
        [1, 0],
        [1, 1],
        [0, 1],
    ],

    // square
    [
        [1, 1],
        [1, 1],
    ],
];

const color = d3.scaleOrdinal()
    .domain(Object.keys(elements).map(n => +n + 1))
    .range([
        // I
        'var(--fig-0)',
        'var(--fig-1)',
        // L
        'var(--fig-2)',
        'var(--fig-3)',
        'var(--fig-4)',
        'var(--fig-5)',
        'var(--fig-6)',
        'var(--fig-7)',
        'var(--fig-8)',
        'var(--fig-9)',
        // T
        'var(--fig-10)',
        'var(--fig-11)',
        'var(--fig-12)',
        'var(--fig-13)',
        // G
        'var(--fig-14)',
        'var(--fig-15)',
        'var(--fig-16)',
        'var(--fig-17)',
        // square
        'var(--fig-18)',
    ]);

let margins = {
    t: 10 * scaling,
    b: 10 * scaling,
    l: 10 * scaling,
    r: 10 * scaling,
};

let b = {
    m: margins,
    w: gridSize * cellSize,
    h: gridSize * cellSize,
};

let d = {
    m: margins,
    w: cellSize * 12 + margins.l + margins.r,
    h: cellSize * 4,
}

let themes = {
    chill: {
        themeClass: "theme-a",
        bigRadius: 6 * scaling,
        smallRadius: 0,
        cellBackgrounds: {
            margin: 0,
            strokeWidth: 0,
        },
        elementRadius: 6 * scaling,
    },
    forest: {
        themeClass: "theme-forest-candy",
        bigRadius: 8 * scaling,
        smallRadius: 2 * scaling,
        cellBackgrounds: {
            margin: 2 * scaling,
            strokeWidth: 1 * scaling,
        },
        elementRadius: 4 * scaling,
    }
}

let themeNames = Object.keys(themes);
let themeIdx = 0;
let theme = themes.chill;

let hdiff = (d.w - b.w) / 2;

let grid = [];

for (let i = 0; i < gridSize * gridSize; i++) {
    grid.push(0);
}

function buildGrid() {
    svg = d3.select(".container")
        .append("svg")
            .attr("width", d.w + b.m.l + b.m.r)
            .attr("height", d.h + padding + b.h + b.m.t + b.m.b);

    // background
    svg.append("rect")
        .attr("class", "board-bg")
        .attr("x", hdiff)
        .attr("width", b.w + b.m.l + b.m.r)
        .attr("height", b.h + b.m.b + b.m.l)
        .attr("rx", theme.bigRadius)
        .attr("ry", theme.bigRadius)
        // .attr("fill", "#8f4f00")
        .attr("fill", "#000")
        .style("fill-opacity", 0.9);
    
    const board = svg.append("g")
        .attr("class", "board")
        .attr("transform", "translate(" + (hdiff + b.m.l) + ", " + b.m.l + ")")
        
    // cellBackgrounds
    board.selectAll(".cell-bg")
        .data(grid)
        .enter()
        .append("rect")
            .attr("data-x", (d, i) => i % gridSize)
            .attr("data-y", (d, i) => (i / gridSize) | 0)
            // .attr("transform", function() {
            //     return `translate(${+this.dataset.x * cellSize}, ${+this.dataset.y * cellSize})`
            // })
            // .attr("width", cellSize)
            // .attr("height", cellSize)
            .attr("stroke", "var(--cell-stroke)")
            .style("stroke-opacity", 1)

            .style("fill-opacity", 1)
            .attr("class", (d, i) => (i % 2) ? "light-cell-bg" : "dark-cell-bg")
            .classed("cell-bg", true)
    
    // cells
    board.selectAll(".cell")
        .data(grid)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${(i % gridSize) * cellSize}, ${((i / gridSize) | 0) * cellSize})`)
        .attr("class", "cell")
        .append("g")
            .attr("class", "elem")
    
    redrawCells(grid);

    applyTheme("chill");
}

function applyTheme(name) {
    if (!themes[name]) return;

    theme = themes[name];
    themeIdx = themeNames.indexOf(name);

    d3.select(".container").attr("class", "container " + theme.themeClass);

    svg.select(".board-bg")
        .attr("rx", theme.bigRadius)
        .attr("ry", theme.bigRadius)

    svg.select(".dash rect")
        .attr("rx", theme.bigRadius)
        .attr("ry", theme.bigRadius)

    let cbg = theme.cellBackgrounds;
    d3.selectAll(".cell-bg")
        .attr("transform", function() {
            return `translate(${+this.dataset.x * cellSize + cbg.margin}, ${+this.dataset.y * cellSize + cbg.margin})`
        })
        .attr("width", cellSize - cbg.margin * 2)
        .attr("height", cellSize - cbg.margin * 2)
        .attr("rx", cbg.margin)
        .attr("ry", cbg.margin)
        .attr("stroke-width", cbg.strokeWidth)
        .attr("stroke", "var(--cell-stroke)")
        .style("stroke-opacity", 1)
}

function drawRect(e) {
    e.append("rect")
        .attr("rx", theme.elementRadius)
        .attr("ry", theme.elementRadius)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("stroke-opacity", 1)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", color)
}

function redrawCells(grid) {
    let deletion = false;

    d3.select(".board")
        .selectAll(".cell")
        .data(grid)
        .select(".elem")
        .each(function(d) {
            let currentVal = +this.dataset.val;

            if (d && !currentVal) {
                drawRect(d3.select(this));
            } else if (currentVal && !d) {
                deletion = true;

                d3.select(this)
                    .select("rect")
                    .transition(t)
                    .ease(d3.easeCubicOut)
                    .attr("height", cellSize - 10 * scaling)
                    .attr("width", cellSize - 10 * scaling)
                    .attr("x", 5 * scaling)
                    .attr("y", 5 * scaling)
                    .transition()
                    .duration(160)
                    // .delay(100)
                    .ease(d3.easeBackIn.overshoot(1.5))
                    .style("fill-opacity", 0)
                    .attr("stroke-width", 0)
                    .attr("height", 0)
                    .attr("width", 0)
                    .attr("x", cellSize / 2)
                    .attr("y", cellSize / 2)
                    .remove();
            }

            this.dataset.val = d;
        })

    if (deletion) {
        nopoint();
        d3.transition().duration(460).on("end", yespoint);
    }
}

function buildDash() {
    svg.append("g")
        .attr("class", "dash")
        .attr("transform", `translate(0, ${b.h + padding})`)
        .append("rect")
        .attr("width", d.w + d.m.l + d.m.r)
        .attr("height", d.h + d.m.t + d.m.b)
        .attr("rx", theme.bigRadius)
        .attr("ry", theme.bigRadius)
        .attr("fill", "#000")
        .style("fill-opacity", 0.9);
}

function nopoint() {
    d3.select(".dash")
        .classed("nopoint", true);
}

function yespoint() {
    d3.select(".dash")
        .classed("nopoint", false);
}

function drawElement(elementIdx, slot) {
    let element = elements[elementIdx];
    let slotSize = 4 * cellSize;
    let sx = margins.l + (margins.l + slotSize) * slot;
    let sy = b.m.t + b.h + padding;
    let ew = element[0].length * cellSize;
    let eh = element.length * cellSize;
    let ex = (cellSize * 4 - ew) / 2;
    let ey = (cellSize * 4 - eh) / 2;

    let s = svg.append("g")
        .attr("class", "element")
        .attr("data-x", sx)
        .attr("data-y", sy)
        .attr("data-ex", ex)
        .attr("data-ey", ey)
        .attr("transform", `translate(${sx}, ${sy})`)
        .attr("fill", d => color(elementIdx + 1))
        .attr("data-elem", elementIdx)

    s.append("rect")
        .attr("width", slotSize)
        .attr("height", slotSize)
        .style("fill-opacity", 0)

    let e = s.append("g")
        .attr("transform", `translate(${ex}, ${ey})`);
    
    e.selectAll(".row")
        .data(element)
        .enter()
        .append("g")
            .attr("class", "row")
            .attr("transform", (d, i) => `translate(0, ${i * cellSize})`)
            .selectAll(".cell")
            .data(d => d)
            .enter()
            .append("rect")
                .attr("class", "cell")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("x", (d, i) => i * cellSize + cellSize / 2)
                .attr("y", (d, i) => cellSize / 2)
                .attr("width", 0)
                .attr("height", 0)
                .attr("rx", theme.elementRadius)
                .attr("ry", theme.elementRadius)
                .style("fill-opacity", d => !!d && 1 || 0)
                .style("stroke-opacity", d => !!d && 1 || 0)
                .transition(t)
                .ease(d3.easeCircleInOut)
                .delay((d, i) => i * 60 + slot * 100)
                .attr("x", (d, i) => i * cellSize)
                .attr("y", 0)
                .attr("width", cellSize)
                .attr("height", cellSize)
    
    function drag(e, element) {
        let o = {
            x: 0,
            y: 0,
        }

        function dragstarted() {
            const parent = this.parentElement;
            parent.removeChild(this);
            parent.appendChild(this);
            o.x = +this.dataset.x;
            o.y = +this.dataset.y;
            // console.log(d3.event, o);
            // d3.select(this).style("fill-opacity", 0);
        }

        function dragged() {
            let s = d3.event.subject;
            o.x = +this.dataset.x + d3.event.x - s.x;
            o.y = +this.dataset.y + d3.event.y - s.y;

            let ex = +this.dataset.ex + o.x;
            let ey = +this.dataset.ey + o.y;
            let gx = Math.round((ex - b.m.l - hdiff) / cellSize);
            let gy = Math.round((ey - b.m.t) / cellSize);

            d3.select(this)
                .attr("transform", `translate(${o.x}, ${o.y})`)
        }

        function dragended() {
            let ex = +this.dataset.ex + o.x;
            let ey = +this.dataset.ey + o.y;
            let gx = Math.round((ex - b.m.l - hdiff) / cellSize);
            let gy = Math.round((ey - b.m.t) / cellSize);

            let success = applyToGrid(this.dataset.elem, gx, gy);
            if (success) {
                checkAndClear();
                randomElems();
            }

            nopoint();

            d3.select(this)
                .transition(t)
                .ease(d3.easeBackOut.overshoot(1.7))
                .attr("transform", `translate(${this.dataset.x}, ${this.dataset.y})`)
                .on("end", yespoint);
        }

        return e.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    }

    drag(svg.selectAll(".element"), element);
}

function checkFilled() {
    let clearRows = [];
    for (let y = 0; y < gridSize; y++) {
        if (checkRow(y)) clearRows.push(y);
    }

    let clearCols = [];
    for (let x = 0; x < gridSize; x++) {
        if (checkCol(x)) clearCols.push(x);
    }

    clear(clearRows, clearCols);

    let total = clearRows.length + clearCols.length;
    score += total * total * 50;

    const points = d3.select(".score .points");
    points.text(score);
}

async function displayWarning() {
    const s = d3.select(".score");
    const message = s.select(".message");
    const points = s.select(".points");
    
    await points.transition(t)
        .style("opacity", 0)
        .end();
    
    await s.transition(t)
        .style("width", "508px");
    
    await message.text("You've been playing for over an hour!")
        .transition(t)
        .style("opacity", 1)
        .transition(t)
        .delay(1000)
        .style("opacity", 0)
        .end();

    await s.transition(t)
        .style("width", "332px");
    
    await message.text("Consider taking a break.")
        .transition(t)
        .style("opacity", 1)
        .transition(t)
        .delay(1000)
        .style("opacity", 0)
        .end();
    
    s.transition(t)
        .style("width", null);
    
    points.transition(t)
        .style("opacity", 1);
}

function checkRow(rowNum) {
    let filled = 0;

    for (let x = 0; x < gridSize; x++) {
        let idx = x + rowNum * gridSize;

        if (grid[idx]) filled++;
    }

    return filled == gridSize;
}

function checkCol(colNum) {
    let filled = 0;

    for (let y = 0; y < gridSize; y++) {
        let idx = colNum + y * gridSize;

        if (grid[idx]) filled++;
    }

    return filled == gridSize;
}

function clear(clearRows, clearCols) {
    for (let row of clearRows) {
        for (let x = 0; x < gridSize; x++) {
            let idx = x + row * gridSize;
    
            grid[idx] = 0;
        }
    }

    for (let col of clearCols) {
        for (let y = 0; y < gridSize; y++) {
            let idx = col + y * gridSize;
    
            grid[idx] = 0;
        }
    }
}

function applyToGrid(elementIdx, gx, gy) {
    let element = elements[elementIdx];
    
    if (gx < 0 || gy < 0 || gx > gridSize - element[0].length || gy > gridSize - element.length) return false;

    let g = [...grid];

    for (let y = 0; y < element.length; y++) {
        for (let x = 0; x < element[y].length; x++) {
            let idx = gx + gy * gridSize + x + y * gridSize;

            if (g[idx] && element[y][x]) return false;

            if (element[y][x]) g[idx] = +elementIdx + 1;
        }
    }

    grid = g;

    return true;
}

function checkAndClear() {
    redrawCells(grid);
    checkFilled();
    redrawCells(grid);
}

buildGrid();
buildDash();

function randomElems() {
    d3.selectAll(".element").remove();

    let indices = [];

    while (indices.length < 3) {
        let idx = (Math.random() * elements.length) | 0;

        if (indices.indexOf(idx) != -1) continue;

        indices.push(idx);
    }

    for (let i = 0; i < indices.length; i++) {
        drawElement(indices[i], i);
    }
}

randomElems();

const hourMS = 60 * 60 * 1000;
// const hourMS = 4 * 1000;

function warn() {
    displayWarning();

    setTimeout(warn, hourMS)
}

setTimeout(warn, hourMS);

document.querySelector(".score").onclick = function() {
    applyTheme(themeNames[(themeIdx + 1) % themeNames.length]);
}