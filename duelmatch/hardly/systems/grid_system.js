const _query = ["Grid"];
const _tiles = ['attack', 'heal', 'shield', 'poison', 'clense', 'stun'];

export default class GridSystem {
  static get entityQuery() { return _query; }

  added(e) {
    e.Grid.genGrid(_tiles);
    window.grid = e.Grid;
  }
};
