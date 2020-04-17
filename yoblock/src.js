let gridSize = 9;
// let cellSize = 50;
let cellSize = (window.innerWidth / 300 | 0) * 10 * window.devicePixelRatio;
let padding = 30;

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

let b = {
    m: { t: 10, b: 10, l: 10, r: 10 },
    w: gridSize * cellSize,
    h: gridSize * cellSize,
};

let d = {
    m: { t: 10, b: 10, l: 10, r: 10 },
    w: cellSize * 12 + 20,
    h: cellSize * 4,
}

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
        .attr("x", hdiff)
        .attr("width", b.w + b.m.l + b.m.r)
        .attr("height", b.h + b.m.b + b.m.l)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", "#8f4f00")
        .attr("fill", "#000")
        .style("fill-opacity", 0.9);
    
    const board = svg.append("g")
        .attr("class", "board")
        .attr("transform", "translate(" + (hdiff + b.m.l) + ", " + b.m.l + ")")
        
    // cellBackgrounds
    board.selectAll(".cell")
        .data(grid)
        .enter()
        .append("rect")
            .attr("transform", (d, i) => `translate(${(i % gridSize) * cellSize}, ${((i / gridSize) | 0) * cellSize})`)
            .attr("width", cellSize + "px")
            .attr("height", cellSize + "px")
            .style("fill-opacity", 1)
            .attr("class", (d, i) => (i % 2) ? "light-cell-bg" : "dark-cell-bg")
            // .attr("stroke", "white")
            // .attr("stroke-width", 1.5)
            // .style("stroke-opacity", 0.5);
    
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
}

function drawRect(e) {
    e.append("rect")
        .attr("rx", 6)
        .attr("ry", 6)
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

    let elements = d3.select(".board")
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
                    .attr("height", cellSize - 10)
                    .attr("width", cellSize - 10)
                    .attr("x", 5)
                    .attr("y", 5)
                    .transition()
                    .duration(160)
                    .delay(100)
                    .ease(d3.easeCubicOut)
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
        d3.transition().duration(560).on("end", yespoint);
    }
}

function buildDash() {
    svg.append("g")
        .attr("class", "dash")
        .attr("transform", `translate(0, ${b.h + padding})`)
        .append("rect")
        .attr("width", d.w + d.m.l + d.m.r)
        .attr("height", d.h + d.m.t + d.m.b)
        .attr("rx", 6)
        .attr("ry", 6)
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
    let ew = element[0].length * cellSize;
    let eh = element.length * cellSize;
    let x = 
        10
        + (cellSize * 4 - ew) / 2
        + 10 * slot
        + slot * 4 * cellSize;
    
    let y =
        10
        + (cellSize * 4 - eh) / 2;

    let e = d3.select(".dash")
        .append("g")
        .attr("class", "element")
        .attr("transform", `translate(${x}, ${y})`)
        .attr("fill", d => color(elementIdx + 1))
        .attr("data-elem", elementIdx);
    
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
                .style("stroke-opacity", 0)
                .attr("x", (d, i) => i * cellSize)
                // .attr("y", 1)
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("rx", 6)
                .attr("ry", 6)
                .style("fill-opacity", 0)
                .transition(t)
                .style("fill-opacity", d => !!d && 1 || 0)
                .style("stroke-opacity", d => !!d && 1 || 0)
    
    function drag(e, element) {
        let o = {
            x: 0,
            y: 0,
        };

        function dragstarted() {
            o.x = this.transform.baseVal[0].matrix.e;
            o.y = this.transform.baseVal[0].matrix.f;
            // d3.select(this).raise().attr("stroke", "black");
        }

        function dragged() {
            let s = d3.event.subject;
            let x = o.x + d3.event.x - s.x;
            let y = o.y + d3.event.y - s.y;

            d3.select(this)
                .attr("transform", `translate(${x}, ${y})`)
        }

        function dragended() {
            let ex = this.transform.baseVal[0].matrix.e;
            let ey = this.transform.baseVal[0].matrix.f;
            let gx = Math.round((ex - b.m.l - hdiff) / cellSize);
            let gy = Math.round((ey + padding + b.h) / cellSize);

            let success = applyToGrid(this.dataset.elem, gx, gy);
            if (success) {
                checkAndClear();
                randomElems();
            }

            nopoint();

            d3.select(this)
                .transition(t)
                .attr("transform", `translate(${o.x}, ${o.y})`)
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
    score += total * cellSize * total;

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
    d3.selectAll(".dash .element").remove();

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
