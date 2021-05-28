const prototypes = {};

prototypes["cell"] = {
  "name": "Cell",
  "components": {
    "Cell": { }
  }
};

prototypes["grid"] = {
  "name": "Grid",
  "components": {
    "Grid": {
      "gridSize": { "x": 6, "y": 6 }
    }
  }
};

Object.freeze(prototypes);

export default prototypes;
