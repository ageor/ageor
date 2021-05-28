// import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import * as THREE from './three.js';
import * as Scene from './scene.js';
import { modPoints } from './popup.js';

const gui = new dat.GUI({
  name: 'Editor',
});

const colorFolder = gui.addFolder('Colors');
let colors = ['Default'];
let colorControllers = [];
let cIdx = 0;

function updateDatDropdown(target, list) {
  list = list.length ? list : [''];

  let innerHTMLStr = '';
  if (list.constructor.name == 'Array') {
    for (let i=0; i < list.length; i++) {
      let str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
      innerHTMLStr += str;
    }
  }

  if (list.constructor.name == 'Object') {
    for (let key in list) {
      let str = "<option value='" + list[key] + "'>" + key + "</option>";
      innerHTMLStr += str;
    }
  }

  if (innerHTMLStr != '') target.domElement.children[0].innerHTML = innerHTMLStr;
}

const palette = {
  Default: '#FFFFFF',
  Default_mat: Scene.addColor('Default', '#FFFFFF'),
  Add: (name, value) => {
    name = name || window.prompt('Color name', 'Color' + cIdx++);

    if (!name) return;

    palette[name] = value || '#FFFFFF';

    colors.push(name);

    const c = {
      col: colorFolder.addColor(palette, name),
      rm: null,
    };

    palette[name + '_mat'] = Scene.addColor(name, palette[name]);

    c.col.onChange((v) => palette[name + '_mat'].color = new THREE.Color(v));

    palette['Remove ' + name] = () => {
      colorFolder.remove(c.col);
      colorFolder.remove(c.rm);

      colors = colors.filter(c => c !== name);

      for (let ctr of colorControllers) {
        updateDatDropdown(ctr, colors);

        if (ctr.getValue() === name) ctr.setValue(colors[0]);
      }
    }

    c.rm = colorFolder.add(palette, 'Remove ' + name);

    for (let ctr of colorControllers) {
      const val = ctr.getValue();
      updateDatDropdown(ctr, colors);
      ctr.setValue(val);
    }
  },
}

colorFolder.add(palette, 'Add');

const geometries = {};
const trash = {};
const geomFolder = gui.addFolder('Geometry');

function geometryCommons(folder, data) {
  const name = data.name;
  data.Remove = () => {
    trash[name] = geometries[name];
    trash[name]['Restore ' + name] = () => {
      delete trash[name]['Restore ' + name];

      const type = trash[name].type;
      switch (type) {
        case 'sphere':
          addSphere(trash[name]);
          break;
        case 'icosahedron':
          addIcosahedron(trash[name]);
          break;
        case 'extrude':
          addExtrude(trash[name]);
          break;
        case 'cylinder':
          addCylinder(trash[name]);
          break;
        case 'box':
          addBox(trash[name]);
          break;
      }
      

      data.mesh.visible = true;
      data.mirrorXMesh.visible = data.MirrorX;

      delete trash[name];

      trashFolder.remove(b);
    };

    data.mesh.visible = false;
    data.mirrorXMesh.visible = false;

    delete geometries[name];

    geomFolder.removeFolder(folder);
    const b = trashFolder.add(trash[name], 'Restore ' + name);
  };

  window.mesh = data.mesh;
  window.mx = data.mirrorXMesh;

  function mirrorTransformChanger(prop, dim, multi = 1) {
    return function(v) {
      data.mirrorXMesh[prop][dim] = v * multi;
    }
  }

  folder.add(data, 'name').onChange(v => folder.name = v);

  const controllers = [];
  let ctr = folder
    .add(data.mesh.position, 'x', -10, 10, 0.01)
    .listen()
    .onChange(mirrorTransformChanger('position', 'x', -1));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.position, 'y', -10, 10, 0.01)
    .listen()
    .onChange(mirrorTransformChanger('position', 'y'));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.position, 'z', -10, 10, 0.01)
    .listen()
    .onChange(mirrorTransformChanger('position', 'z'));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.rotation, 'x', -4, 4, 0.01)
    .listen()
    .name('Rx')
    .onChange(mirrorTransformChanger('rotation', 'x'));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.rotation, 'y', -4, 4, 0.01)
    .listen()
    .name('Ry')
    .onChange(mirrorTransformChanger('rotation', 'y', -1));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.rotation, 'z', -4, 4, 0.01)
    .listen()
    .name('Rz')
    .onChange(mirrorTransformChanger('rotation', 'z', -1));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.scale, 'x', -10, 10, 0.01)
    .listen()
    .name('Sx')
    .onChange(mirrorTransformChanger('scale', 'x'));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.scale, 'y', -10, 10, 0.01)
    .listen()
    .name('Sy')
    .onChange(mirrorTransformChanger('scale', 'y'));
  controllers.push(ctr);

  ctr = folder
    .add(data.mesh.scale, 'z', -10, 10, 0.01)
    .listen()
    .name('Sz')
    .onChange(mirrorTransformChanger('scale', 'z'));
  controllers.push(ctr);

  // nasty, but buggy listen...
  for (let l of folder.__listening) {
    const input = l.domElement.querySelector('input');
    input.onfocus = () => {
      folder.__listening.length = 0;
    }
    input.onblur = () => {
      controllers.forEach(c => c.listen());
    }
  }

  const col = folder.add(data, 'Color', colors);
  col.onChange(v => {
    data.mesh.material = data.mirrorXMesh.material = palette[v + '_mat'];
  });

  colorControllers.push(col);

  folder
    .add(data, 'MirrorX')
    .onChange(v => {
      data.mirrorXMesh.visible = v;
    });
}

let gIdx = 0;
function addSphere(data) {
  let name = data?.name;
  if (!name) {
    name = window.prompt('Geometry name', 'Sphere' + gIdx++);

    if (!name) return;
  }

  const folder = geomFolder.addFolder(name);

  data = data || {
    name,
    type: 'sphere',
    Color: colors[0],
    Radius: 1,
    WSeg: 8,
    HSeg: 6,
    MirrorX: false,
  };

  if (!data.mesh) {
    data.mesh = Scene.addMesh('sphere', data);
    data.mirrorXMesh = Scene.addMesh('sphere', data);
    data.mirrorXMesh.visible = data.MirrorX;
  }

  geometries[name] = data;

  function changeMesh() {
    data.mesh.geometry.dispose();
    data.mesh.geometry = new THREE.SphereGeometry(data.Radius, data.WSeg, data.HSeg);
    data.mirrorXMesh.geometry.dispose();
    data.mirrorXMesh.geometry = new THREE.SphereGeometry(data.Radius, data.WSeg, data.HSeg); 
  }

  folder.add(data, 'Radius').onChange(changeMesh);
  folder.add(data, 'WSeg', 3, 128, 1).onChange(changeMesh);
  folder.add(data, 'HSeg', 2, 128, 1).onChange(changeMesh);

  geometryCommons(folder, data);

  folder.add(data, 'Remove');
}

function addBox(data) {
  let name = data?.name;
  if (!name) {
    name = window.prompt('Geometry name', 'Box' + gIdx++);

    if (!name) return;
  }

  const folder = geomFolder.addFolder(name);

  data = data || {
    name,
    type: 'box',
    Color: colors[0],
    MirrorX: false,
  };

  if (!data.mesh) {
    data.mesh = Scene.addMesh('box', data);
    data.mirrorXMesh = Scene.addMesh('box', data);
    data.mirrorXMesh.visible = data.MirrorX;
  }

  geometries[name] = data;

  geometryCommons(folder, data);

  folder.add(data, 'Remove');
}

function addIcosahedron(data) {
  let name = data?.name;
  if (!name) {
    name = window.prompt('Geometry name', 'Icosahedron' + gIdx++);

    if (!name) return;
  }

  const folder = geomFolder.addFolder(name);

  data = data || {
    name,
    type: 'icosahedron',
    Color: colors[0],
    Radius: 1,
    Detail: 0,
    MirrorX: false,
  };

  if (!data.mesh) {
    data.mesh = Scene.addMesh('ico', data);
    data.mirrorXMesh = Scene.addMesh('ico', data);
    data.mirrorXMesh.visible = data.MirrorX;
  }

  geometries[name] = data;

  function changeMesh() {
    data.mesh.geometry.dispose();
    data.mesh.geometry = new THREE.IcosahedronGeometry(data.Radius, data.Detail);
    data.mirrorXMesh.geometry.dispose();
    data.mirrorXMesh.geometry = new THREE.IcosahedronGeometry(data.Radius, data.Detail); 
  }

  folder.add(data, 'Radius').onChange(changeMesh);
  folder.add(data, 'Detail', 0, 10, 1).onChange(changeMesh);

  geometryCommons(folder, data);

  folder.add(data, 'Remove');
}

function addCylinder(data) {
  let name = data?.name;
  if (!name) {
    name = window.prompt('Geometry name', 'Cylinder' + gIdx++);

    if (!name) return;
  }

  const folder = geomFolder.addFolder(name);

  data = data || {
    name,
    type: 'cylinder',
    Color: colors[0],
    RadiusTop: 1,
    RadiusBottom: 1,
    RadialSegments: 8,
    MirrorX: false,
  };

  if (!data.mesh) {
    data.mesh = Scene.addMesh('cylinder', data);
    data.mirrorXMesh = Scene.addMesh('cylinder', data);
    data.mirrorXMesh.visible = data.MirrorX;
  }

  geometries[name] = data;

  function changeMesh() {
    data.mesh.geometry.dispose();
    data.mesh.geometry = new THREE.CylinderGeometry(data.RadiusTop, data.RadiusBottom, 1, data.RadialSegments);
    data.mirrorXMesh.geometry.dispose();
    data.mirrorXMesh.geometry = new THREE.CylinderGeometry(data.RadiusTop, data.RadiusBottom, 1, data.RadialSegments); 
  }

  folder.add(data, 'RadiusTop', 0, 10, 0.01).onChange(changeMesh);
  folder.add(data, 'RadiusBottom', 0, 10, 0.01).onChange(changeMesh);
  folder.add(data, 'RadialSegments', 2, 32, 1).onChange(changeMesh);

  geometryCommons(folder, data);

  folder.add(data, 'Remove');
}

function addExtrude(data) {
  let name = data?.name;
  if (!name) {
    name = window.prompt('Geometry name', 'Extrude' + gIdx++);

    if (!name) return;
  }

  const folder = geomFolder.addFolder(name);
  data = data || {
    name,
    type: 'extrude',
    Steps: 1,
    Depth: 1,
    Bevel: false,
    BevelThickness: 1,
    BevelSize: 1,
    BevelOffset: 0,
    BevelSegments: 1,
    Color: colors[0],
    MirrorX: false,
  };

  const points = data.points || [
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 0],
  ];

  data.points = points;

  function buildShape() {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0] - 0.5, (1 - points[0][1]) - 0.5);

    let first = true;
    for (let p of points) {
      if (first) {
        first = false;
        continue;
      }

      shape.lineTo(p[0] - 0.5, (1 - p[1]) - 0.5);
    }
    
    data.shape = shape;
  }

  buildShape();

  if (!data.mesh) {
    data.mesh = Scene.addMesh('extrude', data);
    data.mirrorXMesh = Scene.addMesh('extrude', data);
    data.mirrorXMesh.visible = data.MirrorX;
  }

  geometries[name] = data;

  function changeMesh() {
    buildShape();

    const opts = {
      steps: data.steps,
      depth: data.Depth,
      bevelEnabled: data.Bevel,
      bevelThickness: data.BevelThickness,
      bevelSize: data.BevelSize,
      bevelOffset: data.BevelOffset,
      bevelSegments: data.BevelSegments,
    };

    data.mesh.geometry.dispose();
    data.mesh.geometry = new THREE.ExtrudeGeometry(data.shape, opts);

    data.mirrorXMesh.geometry.dispose();
    data.mirrorXMesh.geometry = new THREE.ExtrudeGeometry(data.shape, opts); 
  }

  // folder.add(data, 'RadiusTop', 0, 10, 0.1).onChange(changeMesh);
  // folder.add(data, 'RadiusBottom', 0, 10, 0.1).onChange(changeMesh);
  // folder.add(data, 'RadialSegments', 2, 32, 1).onChange(changeMesh);

  folder.add({ 'Edit Points': () => {
    modPoints(points, changeMesh);
  }}, 'Edit Points');

  geometryCommons(folder, data);

  folder.add(data, 'Remove');
}

const adders = {
  Sphere: addSphere,
  Box: addBox,
  Icosahedron: addIcosahedron,
  Extrude: addExtrude,
  Cylinder: addCylinder,
};

const addFolder = gui.addFolder('Add');

for (let g in adders) {
  addFolder.add(adders, g);
}

// 0 1
// 0 0.5
// 0.1 0.2
// 0.35 0
// 0.65 0
// 0.9 0.2
// 1 0.5
// 1 1


const trashFolder = gui.addFolder('Trash');

export function exportData() {
  const data = {
    gIdx,
    colors: {},
    geometries: {},
  };

  for (let color of colors) {
    data.colors[color] = palette[color];
  }

  const skip = ['Remove', 'mirrorXMesh', 'shape'];

  for (let name in geometries) {
    const geom = geometries[name];

    const g = data.geometries[name] = {};

    for (let prop in geom) {
      if (skip.indexOf(prop) !== -1) continue;

      if (prop === 'mesh') {
        g.x = geom.mesh.position.x;
        g.y = geom.mesh.position.y;
        g.z = geom.mesh.position.z;
        g.rx = geom.mesh.rotation.x;
        g.ry = geom.mesh.rotation.y;
        g.rz = geom.mesh.rotation.z;
        g.sx = geom.mesh.scale.x;
        g.sy = geom.mesh.scale.y;
        g.sz = geom.mesh.scale.z;
      } else {
        g[prop] = geom[prop];
      }
    }
  }

  return data;
}

export function importData(data) {
  gIdx = data.gIdx;

  for (let c in data.colors) {
    if (c === 'Default') continue;

    palette.Add(c, data.colors[c]);
  }

  for (let name in data.geometries) {
    const geom = data.geometries[name];

    let ld = {
      name: geom.name,
      Color: geom.Color,
      MirrorX: geom.MirrorX,
    };

    switch (geom.type) {
      case 'sphere':
        ld = {
          ...ld,
          type: 'sphere',
          Radius: geom.Radius,
          WSeg: geom.WSeg,
          HSeg: geom.HSeg,
        };

        addSphere(ld);
        break;
      case 'box':
        ld = {
          ...ld,
          type: 'box',
        };

        addBox(ld);
        break;
      case 'icosahedron':
        ld = {
          ...ld,
          type: 'icosahedron',
          Radius: geom.Radius,
          Detail: geom.Detail,
        };

        addIcosahedron(ld);
        break;
      case 'cylinder':
        ld = {
          ...ld,
          type: 'cylinder',
          RadiusTop: geom.RadiusTop,
          RadiusBottom: geom.RadiusBottom,
          RadialSegments: geom.RadialSegments,
        };

        addCylinder(ld);
        break;
      case 'extrude':
        ld = {
          ...ld,
          type: 'extrude',
          Steps: geom.Steps,
          Depth: geom.Depth,
          Bevel: geom.Bevel,
          BevelThickness: geom.BevelThickness,
          BevelSize: geom.BevelSize,
          BevelOffset: geom.BevelOffset,
          BevelSegments: geom.BevelSegments,
          points: geom.points,
        };

        addExtrude(ld);
        break;
    }

    ld.mesh.position.x = geom.x;
    ld.mesh.position.y = geom.y;
    ld.mesh.position.z = geom.z;
    ld.mesh.rotation.x = geom.rx;
    ld.mesh.rotation.y = geom.ry;
    ld.mesh.rotation.z = geom.rz;
    ld.mesh.scale.x = geom.sx;
    ld.mesh.scale.y = geom.sy;
    ld.mesh.scale.z = geom.sz;

    ld.mirrorXMesh.position.x = -geom.x;
    ld.mirrorXMesh.position.y = geom.y;
    ld.mirrorXMesh.position.z = geom.z;
    ld.mirrorXMesh.rotation.x = geom.rx;
    ld.mirrorXMesh.rotation.y = -geom.ry;
    ld.mirrorXMesh.rotation.z = -geom.rz;
    ld.mirrorXMesh.scale.x = geom.sx;
    ld.mirrorXMesh.scale.y = geom.sy;
    ld.mirrorXMesh.scale.z = geom.sz;
  }
}

window.shiftAll = function(y, z) {
  for (let name in geometries) {
    geometries[name].mesh.position.y += y;
    geometries[name].mirrorXMesh.position.y += y;
    geometries[name].mesh.position.z += z;
    geometries[name].mirrorXMesh.position.z += z;
  }
}
