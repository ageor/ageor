let _grid = [];
let _moves = [];
let _seed = 1234;

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

function seed(i) {
  m_w = (123456789 + i) & mask;
  m_z = (987654321 - i) & mask;
}

function random() {
  m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
  m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
  var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
  result /= 4294967296;
  return result;
}

function genCheck(tile, x, y) {
  if (_grid[y][x - 1] === tile && _grid[y][x - 2] === tile) {
    return false;
  }

  // lol
  const safety = [];
  if ((_grid[y - 1] ?? safety)[x] === tile && (_grid[y - 2] ?? safety)[x] === tile) {
    return false;
  }

  return true
}

function genGrid(gridSize, tiles) {
  for (let y = 0; y < gridSize.y; y++) {
    _grid[y] = [];
    for (let x = 0; x < gridSize.x; x++) {
      let tile = Math.floor(random() * tiles.length);

      while(!genCheck(tile, x, y)) {
        tile = Math.floor(random() * tiles.length);
      }

      _grid[y][x] = tile;
    }
  }

  const moves = findMoves(gridSize);
  if (moves.length === 0) {
    genGrid(gridSize, tiles);
  } else {
    _moves = moves;
  }
}

function findMoves(gridSize) {
  const moves = [];

  for (let y = 0; y < gridSize.y - 1; y++) {
    for (let x = 0; x < gridSize.x - 1; x++) {
      if (testMove(x, y, x + 1, y) || testMove(x + 1, y, x, y)) {
        moves.push({ x0: x, y0: y, x1: x + 1, y1: y });
      }

      if (testMove(x, y, x, y + 1) || testMove(x, y + 1, x, y)) {
        moves.push({ x0: x, y0: y, x1: x, y1: y + 1 });
      }
    }
  }

  return moves;
}

function swap(x0, y0, x1, y1) {
  const temp = _grid[y0][x0];
  _grid[y0][x0] = _grid[y1][x1];
  _grid[y1][x1] = temp;
}

function tileIs(x, y, type) {
  return (_grid[y] ?? [])[x] === type;
}

function findCluster(x, y) {
  let cluster = [];
  const type = _grid[y][x];

  if (tileIs(x + 1, y, type) && tileIs(x + 2, y, type)) {
    cluster.push({ x: x + 1, y });
    cluster.push({ x: x + 2, y });
  }

  if (tileIs(x - 1, y, type) && tileIs(x - 2, y, type)) {
    cluster.push({ x: x - 1, y });
    cluster.push({ x: x - 2, y });
  }

  if (tileIs(x + 1, y, type) && tileIs(x - 1, y, type)) {
    cluster.push({ x: x + 1, y });
    cluster.push({ x: x - 1, y });
  }

  if (tileIs(x, y + 1, type) && tileIs(x, y + 2, type)) {
    cluster.push({ x, y: y + 1 });
    cluster.push({ x, y: y + 2 });
  }

  if (tileIs(x, y - 1, type) && tileIs(x, y - 2, type)) {
    cluster.push({ x, y: y - 1 });
    cluster.push({ x, y: y - 2 });
  }

  if (tileIs(x, y + 1, type) && tileIs(x, y - 1, type)) {
    cluster.push({ x, y: y + 1 });
    cluster.push({ x, y: y - 1 });
  }

  if (cluster.length) {
    cluster.push({ x, y });
  }

  return cluster;
}

function testMove(x0, y0, x1, y1) {
  swap(x0, y0, x1, y1);

  const originTile = _grid[y1][x1];

  let verticalStreak = 0;
  let horizontalStreak = 0;

  for (let y = y1 - 2; y <= y1 + 2; y++) {
    if (tileIs(x1, y, originTile)) {
      verticalStreak++;
    } else if (verticalStreak >= 3) {
      break;
    } else {
      verticalStreak = 0;
    }
  }

  for (let x = x1 - 2; x <= x1 + 2; x++) {
    if (tileIs(x, y1, originTile)) {
      horizontalStreak++;
    } else if (horizontalStreak >= 3) {
      break;
    } else {
      horizontalStreak = 0;
    }
  }

  if (verticalStreak < 3) {
    verticalStreak = 0;
  }

  if (horizontalStreak < 3) {
    horizontalStreak = 0;
  }

  let magnitude = verticalStreak + horizontalStreak;

  if (verticalStreak && horizontalStreak) {
    magnitude--;
  }

  swap(x0, y0, x1, y1);

  return magnitude;
}

export default class Grid {
  constructor() {
    this.gridSize;
    this.tiles;

    this.gridElements = [];
  }

  genGrid(tiles) {
    _seed = (Math.random() * 1000000) | 0;
    // _seed = 347801;
    _seed = 56306;
    seed(_seed);
    console.log(_seed);
    this.tiles = tiles;
    genGrid(this.gridSize, tiles);
  }

  get moves() {
    return _moves;
  }

  hasMoves() {
    return _moves.length > 0;
  }

  get grid() {
    return _grid;
  }

  calcMagnitude(x0, y0, x1, y1) {
    return [testMove(x0, y0, x1, y1), testMove(x1, y1, x0, y0)];
  }

  swap(x0, y0, x1, y1) {
    swap(x0, y0, x1, y1);

    _moves = findMoves(this.gridSize);
  }

  findCluster(x, y) {
    return findCluster(x, y);
  }

  clearCluster(cluster) {
    for (const c of cluster) {
      _grid[c.y][c.x] = -1;
    }

    const shift = [];

    for (const c of cluster) {
      let delta = 0;

      for (let y = 0; y < this.gridSize.y; y++) {
        if (_grid[y][c.x] === -1) delta++;
      }

      shift.push({
        x: c.x,
        y: c.y,
        delta,
      });
    }

    return shift;
  }
};
