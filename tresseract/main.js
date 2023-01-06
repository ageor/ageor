import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { OrbitControls, MapControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

let cameraPersp, cameraOrtho, currentCamera;
let scene, renderer, orbit;

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;

  cameraPersp.aspect = aspect;
  cameraPersp.updateProjectionMatrix();

  cameraOrtho.left = cameraOrtho.bottom * aspect;
  cameraOrtho.right = cameraOrtho.top * aspect;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function init() {
  renderer = window.renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const aspect = window.innerWidth / window.innerHeight;

  cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
  cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000);
  currentCamera = cameraPersp;

  currentCamera.position.set(-10, 5, 10);
  currentCamera.lookAt(0, 200, 0);

  scene = new THREE.Scene();
  // scene.add(new THREE.GridHelper(10, 10, 0x888888, 0x444444));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(120, 50, 140);
  const helper = new THREE.DirectionalLightHelper( light, 5 );
  scene.add( helper );

  light.castShadow = true;
  light.shadow.camera.left = -140;
  light.shadow.camera.right = 140;
  light.shadow.camera.top = 140;
  light.shadow.camera.bottom = -140;
  light.shadow.camera.near = 10;
  light.shadow.camera.far = 200;

  light.shadow.mapSize.width = 1024 * 4;
  light.shadow.mapSize.height = 1024 * 4;
  window.shad = light.shadow;

  scene.add(light);

  // const ambi = new THREE.AmbientLight(0x202020);
  // const ambi = new THREE.AmbientLight(0xffffff);
  // scene.add(ambi);

  const hemi = new THREE.HemisphereLight( 0xffffff, 0x080808, 1 );
  scene.add(hemi);

  orbit = new MapControls(currentCamera, renderer.domElement);
  orbit.update();
  orbit.enablePan = true;
  // orbit.addEventListener('change', render);

  window.addEventListener('resize', onWindowResize);

  // addMesh();

  // testGrid();

  initVox();

  render();
}

function render() {
  renderer.render(scene, currentCamera);
  requestAnimationFrame(render);
}

// Voxels
const Faces = [
  { // left
    dir: [-1, 0, 0],
    corners: [
      [ 0, 1, 0 ],
      [ 0, 0, 0 ],
      [ 0, 1, 1 ],
      [ 0, 0, 1 ],
    ],
  },
  { // right
    dir: [1, 0, 0],
    corners: [
      [ 1, 1, 1 ],
      [ 1, 0, 1 ],
      [ 1, 1, 0 ],
      [ 1, 0, 0 ],
    ],
  },
  { // bottom
    dir: [0, -1, 0],
    corners: [
      [ 1, 0, 1 ],
      [ 0, 0, 1 ],
      [ 1, 0, 0 ],
      [ 0, 0, 0 ],
    ],
  },
  { // top
    dir: [0, 1, 0],
    corners: [
      [ 0, 1, 1 ],
      [ 1, 1, 1 ],
      [ 0, 1, 0 ],
      [ 1, 1, 0 ],
    ],
  },
  { // back
    dir: [0, 0, -1],
    corners: [
      [ 1, 0, 0 ],
      [ 0, 0, 0 ],
      [ 1, 1, 0 ],
      [ 0, 1, 0 ],
    ],
  },
  { // front
    dir: [0, 0, 1],
    corners: [
      [ 0, 0, 1 ],
      [ 1, 0, 1 ],
      [ 0, 1, 1 ],
      [ 1, 1, 1 ],
    ],
  },
];

class Tresseract {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cell = new Uint8Array(cellSize.x * cellSize.y * cellSize.z);
  }

  getCellForVoxel(x, y, z) {
    const { cellSize } = this;
    const cellX = Math.floor(x / cellSize.x);
    const cellY = Math.floor(y / cellSize.y);
    const cellZ = Math.floor(z / cellSize.z);

    if (cellX !== 0 || cellY !== 0 || cellZ !== 0) {
      return null
    }

    return this.cell;
  }

  getVoxel(x, y, z) {
    const cell = this.getCellForVoxel(x, y, z);

    if (!cell) {
      return 0;
    }

    const voxelOffset = this.computeVoxelOffset(x, y, z);
    return cell[voxelOffset];
  }

  computeVoxelOffset(x, y, z) {
    const {cellSize} = this;
    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize.x) | 0;
    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize.y) | 0;
    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize.z) | 0;
    return voxelY * cellSize.x * cellSize.z +
           voxelZ * cellSize.x +
           voxelX;
  }

  setVoxel(x, y, z, v) {
    let cell = this.getCellForVoxel(x, y, z);

    if (!cell) {
      return;  // TODO: add a new cell?
    }

    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }

  generateGeometry(cx, cy, cz) {
    const cs = this.cellSize;
    const x0 = cx * cs.x;
    const y0 = cy * cs.y;
    const z0 = cz * cs.z;

    const positions = [];
    const normals = [];
    const indices = [];
    const colors = [];

    const color = new THREE.Color();

    const greedy = true;

    // culled
    if (!greedy) {
      for (let y = 0; y < cs.y; y++) {
        const vy = y0 + y;
        for (let z = 0; z < cs.z; z++) {
          const vz = z0 + z;
          for (let x = 0; x < cs.x; x++) {
            const vx = x0 + x;
            const voxel = this.getVoxel(vx, vy, vz);

            if (voxel) {
              for (const { dir, corners } of Faces) {
                const neighbour = this.getVoxel(vx + dir[0], vy + dir[1], vz + dir[2]);

                const c = 0.9 + 0.1 * Math.random();
                // const c = 0.9 + Math.abs(noise.simplex3(vx / 100, vy / 100, vz / 100)) * 0.1;

                if (!neighbour) {
                  // add face
                  const ndx = positions.length / 3;

                  for (const pos of corners) {
                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                    normals.push(...dir);
                    colors.push(c, c, c);
                  }

                  indices.push(
                    ndx, ndx + 1, ndx + 2,
                    ndx + 2, ndx + 1, ndx + 3,
                  );
                }
              }
            }
          }
        }
      }
    } else {
      /* ALGO
      1. Find uni meshes
      1 1 1
      1 0 0
      0 0 2
      2 2 2

      2. March over each mesh
      march(idx)
      2.0? Find mesh bounds for opti?
      2.1 Check one axis (stop when invalid)
      * 1 1
      * 0 0
      X 0 2
      2 2 2
      2.2 Check other dir for all in first axis (stop if any invalid)
      * * 1
      * X 0
      0 0 2
      2 2 2
      3. Build face
      F 1 1
      F 0 0
      0 0 2
      2 2 2
      4. Repeat (checking processed)
      /*
      /* AlGO 2
      1. Uni meshes?
      2. Start drawing a line
      3. Each face has one line that HAS to travel all 4 directions only once
      4. That is the face!
      */

      // greedy
      const planes = [
        {
          normal: { x: -1, y: 0, z: 0 },
        },
        {
          normal: { x: 1, y: 0, z: 0 },
        },
        {
          normal: { x: 0, y: -1, z: 0 },
        },
        {
          normal: { x: 0, y: 1, z: 0 },
        },
        {
          normal: { x: 0, y: 0, z: -1 },
        },
        {
          normal: { x: 0, y: 0, z: 1 },
        },
      ];

      const generateY = (normal, face) => {
        for (let y = 0; y < cs.y; y++) {
          const vy = y0 + y;
          const processed = new Uint8Array(cs.x * cs.z);

          for (let z = 0; z < cs.z; z++) {
            for (let x = 0; x < cs.x; x++) {
              const vx = x0 + x;
              const vz = z0 + z;

              let w = 1;
              let h = 0;

              while(
                !processed[vx + (vz + h) * cs.z] &&
                this.getVoxel(vx, vy, vz + h) &&
                !this.getVoxel(vx + normal.x, vy + normal.y, vz + h + normal.z))
              {
                h++;
              }

              if (h === 0) continue;

              for (let px = vx + 1; px < cs.x; px++) {
                let fill = true;
                for (let pz = vz; pz < vz + h; pz++) {
                  const p = processed[px + pz * cs.z];
                  const v = this.getVoxel(px, vy, pz);
                  const ngh = this.getVoxel(px + normal.x, vy + normal.y, pz + normal.z);

                  if (p || !v || ngh) {
                    fill = false;
                    break;
                  }
                }

                if (fill) {
                  w++;
                } else {
                  break;
                }
              }

              x += w - 1;

              const c = 1;//0.5 + 0.5 * Math.random();

              const ndx = positions.length / 3;

              for (const pos of face.corners) {
                positions.push(pos[0] * w + vx, pos[1] + y, pos[2] * h + vz);
                normals.push(...face.dir);
                colors.push(c, c, c);
              }

              indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3,
              );

              for (let px = 0; px < w; px++) {
                for (let pz = 0; pz < h; pz++) {
                  processed[px + vx + (pz + vz) * cs.z] = 1;
                }
              }
            }
          }
        }
      }

      const generateX = (normal, face) => {
        for (let x = 0; x < cs.x; x++) {
          const vx = x0 + x;
          const processed = new Uint8Array(cs.y * cs.z);

          for (let z = 0; z < cs.z; z++) {
            for (let y = 0; y < cs.y; y++) {
              const vy = y0 + y;
              const vz = z0 + z;

              let w = 1;
              let h = 0;

              while(
                !processed[vy + (vz + h) * cs.y] &&
                this.getVoxel(vx, vy, vz + h) &&
                !this.getVoxel(vx + normal.x, vy + normal.y, vz + h + normal.z))
              {
                h++;
              }

              if (h === 0) continue;

              for (let px = vy + 1; px < cs.y; px++) {
                let fill = true;
                for (let pz = vz; pz < vz + h; pz++) {
                  const p = processed[px + pz * cs.y];
                  const v = this.getVoxel(vx, px, pz);
                  const ngh = this.getVoxel(vx + normal.x, px + normal.y, pz + normal.z);

                  if (p || !v || ngh) {
                    fill = false;
                    break;
                  }
                }

                if (fill) {
                  w++;
                } else {
                  break;
                }
              }

              y += w - 1;

              const c = 1;//0.5 + 0.5 * Math.random();

              const ndx = positions.length / 3;

              for (const pos of face.corners) {
                positions.push(pos[0] + x, pos[1] * w + vy, pos[2] * h + vz);
                normals.push(...face.dir);
                colors.push(c, c, c);
              }

              indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3,
              );

              for (let px = 0; px < w; px++) {
                for (let pz = 0; pz < h; pz++) {
                  processed[px + vy + (pz + vz) * cs.y] = 1;
                }
              }

            }
          }
        }
      }

      const generateZ = (normal, face) => {
        for (let z = 0; z < cs.z; z++) {
          const vz = z0 + z;
          const processed = new Uint8Array(cs.x * cs.y);

          for (let y = 0; y < cs.y; y++) {
            for (let x = 0; x < cs.x; x++) {
              const vx = x0 + x;
              const vy = y0 + y;

              let w = 1;
              let h = 0;

              while(
                !processed[vx + (vy + h) * cs.x] &&
                this.getVoxel(vx, vy + h, vz) &&
                !this.getVoxel(vx + normal.x, vy + h + normal.y, vz + normal.z))
              {
                h++;
              }

              if (h === 0) continue;

              for (let px = vx + 1; px < cs.x; px++) {
                let fill = true;
                for (let pz = vy; pz < vy + h; pz++) {
                  const p = processed[px + pz * cs.x];
                  const v = this.getVoxel(px, pz, vz);
                  const ngh = this.getVoxel(px + normal.x, pz + normal.y, vz + normal.z);

                  if (p || !v || ngh) {
                    fill = false;
                    break;
                  }
                }

                if (fill) {
                  w++;
                } else {
                  break;
                }
              }

              x += w - 1;

              const c = 1;//0.5 + 0.5 * Math.random();

              const ndx = positions.length / 3;

              for (const pos of face.corners) {
                positions.push(pos[0] * w + vx, pos[1] * h + vy, pos[2] + z);
                normals.push(...face.dir);
                colors.push(c, c, c);
              }

              indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3,
              );

              for (let px = 0; px < w; px++) {
                for (let pz = 0; pz < h; pz++) {
                  processed[px + vx + (pz + vy) * cs.x] = 1;
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < planes.length; i++) {
        const plane = planes[i];
        const normal = plane.normal;

        if (!normal) continue;

        if (normal.x) {
          generateX(normal, Faces[i]);
        } else if (normal.y) {
          generateY(normal, Faces[i]);
        } else if (normal.z) {
          generateZ(normal, Faces[i]);
        }
      }
    }

    return {
      positions,
      normals,
      indices,
      colors,
    };
  }
}

function initVox() {
  // let cellSize = { x: 128, y: 128, z: 128 };
  let cellSize = { x: 128, y: 24, z: 128 };

  const debug = false;
  const wireframe = false;
  if (debug) {
    cellSize = { x: 3, y: 3, z: 3 };
  } 

  const world = new Tresseract(cellSize);

  if (debug) {
    world.setVoxel(0, 0, 0, 1);
    world.setVoxel(0, 0, 1, 1);
    world.setVoxel(0, 0, 2, 1);
    world.setVoxel(1, 0, 0, 1);
    world.setVoxel(1, 0, 1, 1);
    world.setVoxel(1, 0, 2, 1);
    world.setVoxel(2, 0, 0, 1);
    world.setVoxel(2, 0, 1, 1);
    world.setVoxel(2, 0, 2, 1);

    world.setVoxel(1, 1, 1, 1);

    world.setVoxel(0, 2, 0, 1);
    world.setVoxel(0, 2, 1, 1);
    world.setVoxel(0, 2, 2, 1);
    world.setVoxel(1, 2, 0, 1);
    world.setVoxel(1, 2, 1, 1);
    world.setVoxel(1, 2, 2, 1);
    world.setVoxel(2, 2, 0, 1);
    world.setVoxel(2, 2, 1, 1);
    world.setVoxel(2, 2, 2, 1);
  } else {
    const seed = 0.9004163739990061;//Math.random();
    noise.seed(seed);
    // console.log(seed);

    const heightMap = new Uint8Array(cellSize.x * cellSize.z);

    for (let x = 0; x < cellSize.x; x++) {
      for (let z = 0; z < cellSize.z; z++) {
        const noiseLarge = noise.simplex2(x / 128, z / 128);
        const noiseDetail = noise.simplex2(z * 2 / 64, x * 2 / 64);
        const height = (noiseLarge * 0.9 + noiseDetail * 0.1 + 1) * 12;

        heightMap[x + z * cellSize.x] = height | 0;
      }
    }
     
    for (let y = 0; y < cellSize.y; ++y) {
      for (let z = 0; z < cellSize.z; ++z) {
        for (let x = 0; x < cellSize.x; ++x) {
          // const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
          // const height = (noise.simplex2(x / cellSize, z / cellSize) + 1) * cellSize * 0.2;
          const height = heightMap[x + z * cellSize.x];
          if (y < height) {
            world.setVoxel(x, y, z, 1);
          }

          // const on = noise.simplex3(x / 128, y / 128, z / 128) > 0;
          // if (on) {
          //   world.setVoxel(x, y, z, 1);
          // }
        }
      }
    }
  }

  const {positions, normals, indices, colors } = world.generateGeometry(0, 0, 0);
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.MeshLambertMaterial({ vertexColors: true, color: 0x197419, wireframe });
   
  const positionNumComponents = 3;
  const normalNumComponents = 3;
  geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  geometry.setIndex(indices);

  const mesh = new THREE.Mesh(geometry, material);

  // mesh.position.x = -10;
  // mesh.position.y = -20;
  // mesh.position.z = -60;

  window.msh = mesh;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  document.addEventListener('keypress', (event) => {
    // var name = event.key;
    // var code = event.code;
    // Alert the key name and key code on keydown
    // console.log(`Key pressed ${name} \r\n Key code value: ${code}`, event);

    if (event.keyCode === 119) {
      material.wireframe = !material.wireframe;
    }
  }, false);
}

// Instanced thing

let mesh = null;

function addMesh() {
  const geom = new THREE.BoxGeometry(1, 1, 1);

  const mat = new THREE.MeshPhongMaterial({
    color: 0x68c3c0,
    // color: 0xff0000,
    // flatShading: true,
    // transparent: true,
    // depthWrite: false,
    // opacity: 0.5,
  });

  const instanceCount = 16384;
  mesh = new THREE.InstancedMesh(geom, mat, instanceCount);

  scene.add(mesh);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color(0x68c3c0);

  for (let i = 0; i < instanceCount; i++) {
    matrix.setPosition(0, 0, 0);
    matrix.makeScale(0, 0, 0);

    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color);
  }

  mesh.castShadow = true;
  // mesh.receiveShadow = true;
}

const T = {
  Empty: 0,
  Water: 1,
  Grass: 2,
  Mountain: 4,
  Rock: 3,
};

const gridDimentions = {
  width: 128,
  height: 128,
};

function testGrid() {
  // const grid = [
  //   T.Grass, T.Grass, T.Grass, T.Grass, T.Grass, T.Grass,
  //   T.Grass, T.Grass, T.Grass, T.Grass, T.Grass, T.Grass,
  //   T.Grass, T.Grass, T.Water, T.Water, T.Grass, T.Grass,
  //   T.Grass, T.Grass, T.Water, T.Grass, T.Grass, T.Grass,
  //   T.Grass, T.Grass, T.Grass, T.Grass, T.Grass, T.Grass,
  //   T.Grass, T.Grass, T.Grass, T.Grass, T.Grass, T.Grass,
  // ];

  noise.seed(Math.random());


  // if (grid.length !== gridDimentions.width * gridDimentions.height) {
  //   console.warn('Assymetric grid');
  //   return;
  // }

  const scale = 0.1;

  const ox = -gridDimentions.width / 2 + 0.5;
  const oy = -gridDimentions.height / 2 + 0.5;

  for (let x = 0; x < gridDimentions.width; x++) {
    for (let y = 0; y < gridDimentions.height; y++) {
      const i = x + y * gridDimentions.width;
      // const tile = grid[i];
      const tile = getTileType(x, y);

      const props = getTileProps(tile, x, y);

      const matrix = new THREE.Matrix4();

      matrix.makeScale(props.width * scale, props.height * scale, props.width * scale);
      matrix.setPosition((x + ox) * scale, props.height / 2 * scale, (y + oy) * scale);

      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, props.color);
    }
  }
}

function getTileType(x, y) {
  let tile = noise.simplex2(x / gridDimentions.width, y / gridDimentions.height);
  tile += 1;
  tile /= 2;
  // tile = Math.abs(tile);

  return Math.round(tile * 3) + 1;
}

function getTileProps(tileType, x, y) {
  switch(tileType) {
    case T.Grass:
      return getGrassProps();
    case T.Water:
      return getWaterProps();
    case T.Rock:
      return getRockProps();
    case T.Mountain:
      return getMountainProps();
  }
}

function getGrassProps() {
  const c = {
    h: 137 + Math.round(Math.random() * 4) - 2,
    s: 96 + Math.round(Math.random() * 4) - 2,
    l: 22 + Math.round(Math.random() * 2) - 1,
  };

  return {
    color: new THREE.Color(`hsl(${c.h}, ${c.s}%, ${c.l}%)`),
    width: 1,
    height: 1 + Math.random() * 0.05,
  };
}

function getWaterProps() {
  return {
    color: new THREE.Color(0x68c3c0),
    width: 1,
    height: 0.7,
  };
}

function getRockProps() {
  const c = {
    h: 137 + Math.round(Math.random() * 4) - 2,
    s: 96 + Math.round(Math.random() * 4) - 2,
    l: 18 + Math.round(Math.random() * 2) - 1,
  };

  return {
    color: new THREE.Color(`hsl(${c.h}, ${c.s}%, ${c.l}%)`),
    width: 1,
    height: 1.2 + Math.random() * 0.2,
  };
}

function getMountainProps() {
  const c = {
    h: 137 + Math.round(Math.random() * 4) - 2,
    s: 96 + Math.round(Math.random() * 4) - 2,
    l: 12 + Math.round(Math.random() * 2) - 1,
  };

  return {
    color: new THREE.Color(`hsl(${c.h}, ${c.s}%, ${c.l}%)`),
    width: 1,
    height: 1.6 + Math.random() * 0.4,
  };
}