const _query = ["Grid"];
let _tileSize = 0;

function getElementIndex(node) {
  var index = 0;

  while (node.previousElementSibling) {
    index++;
    node = node.previousElementSibling;
  }

  return index;
}

function bindEvents(grid) {
  const dragStart = { x: 0, y: 0 };
  const container = document.querySelector('.container');
  let sourceTile = null;
  let destinationTile = null;

  function swapTiles() {
    grid.swap(sourceTile.x, sourceTile.y, destinationTile.x, destinationTile.y);

    const s = sourceTile.tile;
    const d = destinationTile.tile;
    s.setStyle(grid.tiles[grid.grid[sourceTile.y][sourceTile.x]]);
    d.setStyle(grid.tiles[grid.grid[destinationTile.y][destinationTile.x]]);

    s.setPosition(0, 0, true);
    d.setPosition(0, 0, true);

    const ds = s.scale;
    s.setScale(d.scale, true);
    d.setScale(ds, true);
  }

  function resetTiles() {
    for (let cell of grid.gridElements) {
      cell.Cell
        .setPosition(0, 0, true)
        .setScale(0.9, true);
        // .setStyle();
    }
  }

  function shiftTiles(shift) {
  }

  function select(e) {
    if (e.target === container) {
      return;
    }

    const tile = e.target;
    const tileIdx = getElementIndex(tile);

    const gridTile = grid.gridElements[tileIdx].Cell;
    gridTile.select();

    const x = tileIdx % grid.gridSize.x;
    const y = (tileIdx / grid.gridSize.y) | 0;

    sourceTile = { x, y, tile: gridTile };

    dragStart.x = e.touches ? e.touches[0].clientX : e.clientX;
    dragStart.y = e.touches ? e.touches[0].clientY : e.clientY;

    e.preventDefault();

    return false;
  }

  function tileIs(x, y, type) {
    return (grid.grid[y] || [])[x] === type;
  }

  function pushNode(nodes, x, y) {
    const node = container.children[y * grid.gridSize.x + x];

    if (nodes.indexOf(node) === -1) {
      nodes.push(node);
    }
  }

  function findCluster(x, y) {
    const cluster = grid.findCluster(x, y);
    const indices = [];

    for (let c of cluster) {
      indices.push(c.x + c.y * grid.gridSize.y);
    }

    const type = grid.grid[y][x];

    return {
      type,
      indices,
      cluster,
    };
  }

  function deselect(e) {
    if (!sourceTile) {
      return;
    }

    const tileIdx = getElementIndex(e.target);

    if (destinationTile) {
      const magnitude = grid.calcMagnitude(
        sourceTile.x,
        sourceTile.y,
        destinationTile.x,
        destinationTile.y
      );

      if (magnitude[0] + magnitude[1]) {
        swapTiles();        

        if (magnitude[0]) {
          const cluster = findCluster(destinationTile.x, destinationTile.y);

          for (let idx of cluster.indices) {
            grid.gridElements[idx].Cell.hide();
          }

          const shift = grid.clearCluster(cluster.cluster);

          shiftTiles(shift);
        } else {
          destinationTile.tile.deselect();
        }

        if (magnitude[1]) {
          const cluster = findCluster(sourceTile.x, sourceTile.y);

          for (let idx of cluster.indices) {
            grid.gridElements[idx].Cell.hide();
          }

          const shift = grid.clearCluster(cluster.cluster);

          shiftTiles(shift);
        } else {
          sourceTile.tile.setScale(0.9, true);
        }
      } else {
        destinationTile.tile.setPosition(0, 0);
        sourceTile.tile.setPosition(0, 0).deselect();
      }
    } else {
      sourceTile.tile.deselect();
    }

    sourceTile = null;
    destinationTile = null;
  }

  function move(deltaX, deltaY) {
    let offsetX = 0;
    let offsetY = 0;

    const {x, y} = sourceTile;

    if ((x > 0 && deltaX < -_tileSize / 2) || (x < grid.gridSize.x - 1 && deltaX > _tileSize / 2)) {
      offsetX = Math.sign(deltaX) * _tileSize;
    } else {
      offsetX = 0;
    }

    if ((y > 0 && deltaY < -_tileSize / 2) || (y < grid.gridSize.y - 1 && deltaY > _tileSize / 2)) {
      offsetY = Math.sign(deltaY) * _tileSize;
    } else {
      offsetY = 0;
    }

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      offsetX = 0;
    } else {
      offsetY = 0;
    }

    if (destinationTile) {
      destinationTile.tile.setPosition(0, 0);
      destinationTile = null;
    }

    if (offsetX) {
      const sign = Math.sign(offsetX);
      const altIdx = y * grid.gridSize.x + x + sign;
      const tile = grid.gridElements[altIdx].Cell;

      destinationTile = {
        x: x + sign,
        y,
        tile,
      };

      tile.setPosition(-offsetX, 0);
    }

    if (offsetY) {
      const sign = Math.sign(offsetY);
      const altIdx = (y + sign) * grid.gridSize.x + x;
      const tile = grid.gridElements[altIdx].Cell;

      destinationTile = {
        x,
        y: y + sign,
        tile,
      };

      tile.setPosition(0, -offsetY);
    }

    sourceTile.tile.setPosition(offsetX, offsetY);
  }

  container.onmousedown = select;
  container.ontouchstart = select;
  container.onmouseup = deselect;
  container.ontouchend = deselect;

  container.onmousemove = function(e) {
    if (!sourceTile) {
      return;
    }

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    move(deltaX, deltaY);
  }

  container.ontouchmove = function(e) {
    if (!sourceTile) {
      return;
    }

    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;

    move(deltaX, deltaY);
  }
}

export default class GridDisplaySystem {
  static get entityQuery() { return _query; }

  constructor(app) {
    this.app = app;
  }

  added(e) {
    const container = document.querySelector('.container');
    const grid = e.Grid;

    bindEvents(grid);

    const cDim = Math.min(container.offsetWidth, container.offsetHeight) - 20;
    const tDim = Math.max(grid.gridSize.x, grid.gridSize.y);

    _tileSize = (cDim / tDim) | 0;

    for (let y = 0; y < grid.gridSize.y; y++) {
      for (let x = 0; x < grid.gridSize.x; x++) {
        const cell = this.app.load('cell');

        cell.Cell.init(container, grid, _tileSize, x + y * grid.gridSize.y);

        const c = grid.tiles[grid.grid[y][x]];

        cell.Cell.setStyle(c);

        grid.gridElements.push(cell);
      }
    }
  }
};
