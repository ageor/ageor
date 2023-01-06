import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { MapControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

let cameraPersp, cameraOrtho, currentCamera;
let scene, renderer, controls;
let levelMesh, level;

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
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const aspect = window.innerWidth / window.innerHeight;

  cameraPersp = new THREE.PerspectiveCamera(50, aspect, 0.01, 30000);
  cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000);
  currentCamera = cameraPersp;

  currentCamera.position.set(0, 15, 10);
  currentCamera.lookAt(0, 200, 0);

  scene = new THREE.Scene();

  const ambi = new THREE.AmbientLight(0xffffff);
  scene.add(ambi);

  const hemi = new THREE.HemisphereLight( 0xffffff, 0x080808, 1 );
  scene.add(hemi);

  controls = new MapControls(currentCamera, renderer.domElement);
  controls.update();
  controls.enablePan = true;

  window.addEventListener('resize', onWindowResize);

  window.level = level = new Level();
  level.init();

  level.construct({ width: 16, height: 16 });

  render();
}


function render() {
  renderer.render(scene, currentCamera);
  requestAnimationFrame(render);
}

class Level {
  constructor() {
    this.mesh = null;
    this.gridDimentions = null;
    this.scale = 1;
    this.margin = 0.02;
  }

  init() {
    const geom = new THREE.BoxGeometry(1, 1, 1);

    const mat = new THREE.MeshPhongMaterial({
      color: 0x999999,
      // color: 0xff0000,
      // flatShading: true,
      // transparent: true,
      // depthWrite: false,
      // opacity: 0.5,
    });

    const instanceCount = 16384;
    this.mesh = new THREE.InstancedMesh(geom, mat, instanceCount);

    scene.add(this.mesh);

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color(0x999999);

    for (let i = 0; i < instanceCount; i++) {
      matrix.setPosition(0, 0, 0);
      matrix.makeScale(0, 0, 0);

      this.mesh.setMatrixAt(i, matrix);
      this.mesh.setColorAt(i, color);
    }

    // levelMesh.castShadow = true;
    // levelMesh.receiveShadow = true;
  }

  construct(gridDimentions) {
    this.gridDimentions = gridDimentions;

    const grid = [];

    for (let i = 0; i < gridDimentions.width * gridDimentions.height; i++) {
      grid.push(1);
    }

    this.scale = 10 / Math.max(gridDimentions.width, gridDimentions.height);
    const blockSize = 1 - this.margin;

    const ox = -gridDimentions.width / 2 + 0.5;
    const oy = -gridDimentions.height / 2 + 0.5;

    for (let x = 0; x < gridDimentions.width; x++) {
      for (let y = 0; y < gridDimentions.height; y++) {
        const i = x + y * gridDimentions.width;
        const tile = grid[i];
        // const tile = getTileType(x, y);

        // const props = getTileProps(tile, x, y);

        const matrix = new THREE.Matrix4();

        // matrix.makeScale(props.width * scale, props.height * scale, props.width * scale);
        // matrix.setPosition((x + ox) * scale, props.height / 2 * scale, (y + oy) * scale);

        // mesh.setMatrixAt(i, matrix);
        // mesh.setColorAt(i, props.color);

        matrix.makeScale(blockSize * this.scale, blockSize, blockSize * this.scale);
        matrix.setPosition((x + ox) * this.scale, 0, (y + oy) * this.scale);

        this.mesh.setMatrixAt(i, matrix);
        // mesh.setColorAt(i, props.color);
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    // this.mesh.instanceColor.needsUpdate = true;
  }

  setColorAt(x, y, color) {
    const c = new THREE.Color(color);
    this.mesh.setColorAt(x + y * this.gridDimentions.width, c);
    this.mesh.instanceColor.needsUpdate = true;
  }

  setHeightAt(x, y, h) {
    h -= 1;
    h *= this.scale;
    const i = (x + y * this.gridDimentions.width) * 16;
    this.mesh.instanceMatrix.array[i + 5] = 1 + h - this.margin;
    this.mesh.instanceMatrix.array[i + 13] = h / 2;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}