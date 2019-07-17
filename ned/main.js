(function(document, window) {
    function initTorches() {
        let solved = false;
        let torches = document.querySelectorAll(".torches td");

        for (let i = 0; i < torches.length; i++) {
            let torch = torches[i];

            let x = i % 3;
            let y = (i / 3) | 0;
            
            torch.onclick = function() {
                if (solved) return;
                
                torch.children[0].classList.toggle("active");

                let left = (x - 1) + y * 3;
                let right = (x + 1) + y * 3;
                let above = x + (y - 1) * 3;
                let below = x + (y + 1) * 3;

                if (x - 1 >= 0) torches[left].children[0].classList.toggle("active");
                if (x + 1 < 3) torches[right].children[0].classList.toggle("active");
                if (y - 1 >= 0) torches[above].children[0].classList.toggle("active");
                if (y + 1 < 3) torches[below].children[0].classList.toggle("active");

                solved = document.querySelectorAll(".torches td .button.active").length == 9;
                
                if (solved) {
                    solveRune("torch");
                }
            };
        }
    }

    function initRiddle() {
        let solved = false;
        let solution = document.getElementById("the_e");

        solution.onclick = function() {
            if (solved) return;

            solved = true;

            document.getElementById("riddle").classList.add("solved");
            document.getElementById("gate").classList.add("active");
            solveRune("riddle");
        }
    }

    function initMaze() {
        let mazeDiv = document.getElementById("maze");
        let solved = false;

        const lights = [
            { x: 0, y: 0, rune: "T", },
            { x: 0, y: 3, rune: "H", },
            { x: 2, y: 3, rune: "E", },
            { x: 2, y: 1, rune: "D", },
            { x: 4, y: 1, rune: "A", },
            { x: 4, y: 4, rune: "Y", },
        ];

        const gridLayout = [
            0, 1, 0, 1, 1,
            0, 1, 1, 0, 0,
            1, 1, 0, 0, 1,
            0, 1, 1, 1, 0,
            0, 0, 1, 0, 0,
        ];

        let grid = [];

        function reorderGrid() {
            for (let gridItem of grid) {
                gridItem.div.style.left = gridItem.x * 80 + 10 + "px";
                gridItem.div.style.top = gridItem.y * 80 + 10 + "px";
            }
        }

        function recalculateLights() {
            function blocked(x0, y0, x1, y1) {
                return grid.find((el) => {
                    return el.x <= x1 && el.x >= x0 && el.y <= y1 && el.y >= y0 && el.blocker;
                }) != undefined;
            }

            for (let light of lights) {
                light.div.classList.remove("active");
            }

            for (let i = 0; i < lights.length; i++) {
                if (i == 0) {
                    lights[i].div.classList.add("active");

                    continue;
                }

                let current = lights[i];
                let last = lights[i - 1];
                let off = blocked(
                    Math.min(current.x, last.x),
                    Math.min(current.y, last.y),
                    Math.max(current.x, last.x),
                    Math.max(current.y, last.y)
                );

                if (!off) {
                    lights[i].div.classList.add("active");
                } else {
                    break;
                }
            }
        }

        for (let light of lights) {
            let lightDiv = document.createElement("div");
            lightDiv.classList.add("light");
            lightDiv.innerText = light.rune;

            lightDiv.style.left = light.x * 80 + "px";
            lightDiv.style.top = light.y * 80 + "px";

            light.div = lightDiv;

            mazeDiv.appendChild(lightDiv);
        }

        for (let i = 0; i < gridLayout.length; i++) {
            let x = i % 5;
            let y = (i / 5) | 0;

            let gridItem = gridLayout[i];
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("block");

            gridItem == 1 && itemDiv.classList.add("stop");

            mazeDiv.appendChild(itemDiv);

            grid.push({ x: x, y: y, div: itemDiv, blocker: gridItem == 1, });
        }

        reorderGrid();
        recalculateLights();

        for (let i = 0; i < gridLayout.length; i++) {
            let x = 1 + i % 5;
            let y = 1 + (i / 5) | 0;

            if (x > 4 || y > 4) {
                continue;
            }

            let buttonDiv = document.createElement("div");
            buttonDiv.classList.add("button");

            buttonDiv.style.left = x * 80 - 10 + "px";
            buttonDiv.style.top = y * 80 - 10 + "px";

            mazeDiv.appendChild(buttonDiv);

            buttonDiv.onclick = function() {
                if (solved) return;

                let a = grid.find((el) => { return el.x == x - 1 && el.y == y - 1; });
                let b = grid.find((el) => { return el.x == x && el.y == y - 1; });
                let c = grid.find((el) => { return el.x == x && el.y == y; });
                let d = grid.find((el) => { return el.x == x - 1 && el.y == y; });
                a && a.x++;
                b && b.y++;
                c && c.x--;
                d && d.y--;

                reorderGrid();
                recalculateLights();

                solved = lights[lights.length - 1].div.classList.contains("active");

                solved && solveRune("maze");
            }
        }
    }

    function initMath() {
        let mathDiv = document.getElementById("math");
        let solved = false;
        // const treeLayout = [
        //     [4],
        //     [-1, 5],
        //     [-2, 1, 4],
        //     [0, -2, 3, 1],
        //     [3, -3, 1, 2, -1],
        // ];

        const treeLayout = [
            [-1],
            [5, 4],
            [-2, 1, 4],
            [-3, -2, 0, 1],
            [3, 3, 1, 2, -1],
        ];

        const solutionCheck = [
            { row: 0, idx: 0, val: 4},
            { row: 3, idx: 0, val: 0},
            { row: 3, idx: 1, val: -2},
            { row: 3, idx: 2, val: 3},
            { row: 4, idx: 1, val: -3},
            { row: 4, idx: 2, val: 1},
        ];

        const locked = [
            { row: 2, idx: 0},
            { row: 2, idx: 1},
            { row: 2, idx: 2},
            { row: 3, idx: 3},
            { row: 4, idx: 0},
            { row: 4, idx: 3},
            { row: 4, idx: 4},
        ];

        const buttons = [
            [{row: 0, idx: 0}, {row: 1, idx: 0}, {row: 1, idx: 1}],
            // [{row: 1, idx: 0}, {row: 1, idx: 1}, {row: 2, idx: 1}],
            // [{row: 2, idx: 1}, {row: 3, idx: 1}, {row: 3, idx: 2}],
            [{row: 3, idx: 0}, {row: 3, idx: 1}, {row: 4, idx: 1}],
            [{row: 3, idx: 1}, {row: 3, idx: 2}, {row: 4, idx: 2}],
        ];

        let tree = [];

        function check() {
            for (let solution of solutionCheck) {
                let treeItem = tree.find((el) => {
                    return el.row == solution.row && el.idx == solution.idx && el.value == solution.val;
                });

                if (!treeItem) return false;
            }

            return true;
        }

        function reorderTree() {
            for (let treeItem of tree) {
                let row = treeItem.row;
                let idx = treeItem.idx;

                let offset = 40;
                if (row < 1) offset = 2.5 * 80;
                else if (row < 2) offset = 2 * 80;
                else if (row < 3) offset = 1.5 * 80;
                else if (row < 4) offset = 80;

                treeItem.div.style.top = row * 80 + 10 + "px";
                treeItem.div.style.left = idx * 80 + 10 + offset + "px";
            }
        }

        for (let i = 0; i < treeLayout.length; i++) {
            let row = treeLayout[i];

            for (let j = 0; j < row.length; j++) {
                let treeItem = row[j];
                let itemDiv = document.createElement("div");
                itemDiv.classList.add("block");

                let lock = !!locked.find((el) => {
                    return el.row == i && el.idx == j;
                });

                lock && itemDiv.classList.add("locked")

                itemDiv.innerText = treeItem;

                mathDiv.appendChild(itemDiv);

                tree.push({ row: i, idx: j, div: itemDiv, value: treeItem });
            }
        }

        for (let buttonData of buttons) {
            let buttonDiv = document.createElement("div");
            buttonDiv.classList.add("button");

            let row = buttonData[0].row;
            let idx = buttonData[0].idx;
            let x = idx + 0.5;
            let y = row + 1;
            let alt = y % 2;

            let offset = 40;
            if (row < 2) offset = 2.5 * 80;
            else if (row < 4) offset = 1.5 * 80;

            buttonDiv.style.left = offset + x * 80 - 10 + "px";
            buttonDiv.style.top = y * 80 - (alt ? 2 : 18) + "px";

            mathDiv.appendChild(buttonDiv);

            buttonDiv.onclick = function() {
                if (solved) return;

                let a = tree.find((el) => { return buttonData[0].idx == el.idx && buttonData[0].row == el.row; });
                let b = tree.find((el) => { return buttonData[1].idx == el.idx && buttonData[1].row == el.row; });
                let c = tree.find((el) => { return buttonData[2].idx == el.idx && buttonData[2].row == el.row; });
                
                if (alt) {
                    a && a.row++;
                    a && a.idx++;
                    b && b.row--;
                    c && c.idx--;
                } else {
                    a && a.idx++;
                    b && b.row++;
                    c && c.row--;
                    c && c.idx--;
                }

                reorderTree();

                solved = check()

                if (solved) {
                    mathDiv.classList.add("solved");
                    solveRune("math");
                }
            }
        }

        let resetDiv = document.createElement("div");
        resetDiv.classList.add("button");
        resetDiv.style.top = "470px";
        resetDiv.style.left = "230px";
        mathDiv.appendChild(resetDiv);

        let text = document.createElement("div");
        text.classList.add("text");
        text.innerText = "Reset";
        text.style.top = "420px";
        text.style.left = "190px";
        mathDiv.appendChild(text);

        resetDiv.onclick = function() {
            if (solved) return;
            mathDiv.innerHTML = "";
            initMath();
        }

        reorderTree();
    }

    window.addEventListener("load", function() {
        initRiddle();
        initTorches();
        initMaze();
        initMath();
    });
})(document, window);
