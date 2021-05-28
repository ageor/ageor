// import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import * as THREE from './three.js';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "https://threejs.org/examples/jsm/controls/TransformControls.js";
import { BufferGeometryUtils } from "https://threejs.org/examples/jsm/utils/BufferGeometryUtils.js";
import { constructGeometry } from './builder.js';

let cameraPersp, cameraOrtho, currentCamera;
let scene, renderer, control, orbit;

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
  renderer = window.renderer = new THREE.WebGLRenderer();
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
  scene.add(new THREE.GridHelper(10, 10, 0x888888, 0x444444));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(2, 5, 10);

  light.castShadow = true;
  // light.shadow.camera.left = -400;
  // light.shadow.camera.right = 400;
  // light.shadow.camera.top = 400;
  // light.shadow.camera.bottom = -400;
  // light.shadow.camera.near = 0.001;
  // light.shadow.camera.far = 10;

  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  scene.add(light);

  // const ambi = new THREE.AmbientLight(0x202020);
  // scene.add(ambi);

  const hemi = new THREE.HemisphereLight( 0xffffff, 0x080808, 1 );
  scene.add(hemi);

  orbit = new OrbitControls(currentCamera, renderer.domElement);
  orbit.update();
  // orbit.addEventListener('change', render);

  control = new TransformControls(currentCamera, renderer.domElement);
  // control.addEventListener('change', render);
  control.setSpace('world');
  control.setRotationSnap(Math.PI / 4);

  window.ctrl = control;
  scene.add(control);

  control.addEventListener('dragging-changed', function (event) {
    orbit.enabled = !event.value;
  });

  const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
  const mouseDom = { x: 0, y: 0 };
  function select() {
    // const draggableObjects = controls.getObjects();
    // draggableObjects.length = 0;

    raycaster.setFromCamera( mouse, currentCamera );
    const intersections = raycaster.intersectObjects( objects );

    // console.log(intersections.length);

    if ( intersections.length > 0 ) {
      const object = intersections[ 0 ].object;

      control.attach( object );
      control.showX = control.showY = control.showZ = true;
      control.setMode('translate');
    }
  }

  window.addEventListener('resize', onWindowResize);

  window.addEventListener('mousemove', (event) => {
    mouseDom.x = event.clientX; 
    mouseDom.y = event.clientY;
  });

  window.addEventListener('keydown', function(event) {
    // console.log(event.keyCode);
    switch (event.keyCode) {
      case 65: // A
        control.showX = control.showY = control.showZ = true;
        break;
      case 80: // P
        mouse.x = (mouseDom.x / window.innerWidth) * 2 - 1;
        mouse.y = -(mouseDom.y / window.innerHeight) * 2 + 1;

        select();
        break;
      case 82: // R
        control.setMode('rotate');
        break;
      case 83: // S
        control.setMode('scale');
        break;
      case 84: // T
        control.setMode('translate');
        break;
      case 88: // X
        control.showX = true;
        control.showY = control.showZ = false;
        break;
      case 89: // Y
        control.showY = true;
        control.showX = control.showZ = false;
        break;
      case 90: // Z
        control.showZ = true;
        control.showY = control.showX = false;
        break;
      case 16: // Shift
        break;
      case 27: // esc
        control.detach();
        break;
    }
  });

  render();
}

function render() {
  renderer.render(scene, currentCamera);
  requestAnimationFrame(render);
}

const colors = {};
const objects = [];

export function addColor(name, color) {
  colors[name] = colors[name] || new THREE.MeshPhongMaterial({
    flatShading: true,
    // testicles: ['asd'],
  });

  // geom.setAttribute(
  //   "aAlpha",
  //   new THREE.InstancedBufferAttribute(P_OPA, 1, false)
  // );

  colors[name].color = new THREE.Color(color);

  window.mad = colors[name];
  return colors[name];
}

export function addMesh(type, opts) {
  const geometry = constructGeometry(type, opts);

  const mesh = new THREE.Mesh(geometry, colors[opts.Color]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  objects.push(mesh);

  scene.add(mesh);

  return mesh;
}

export function addModel(mesh) {
  scene.add(mesh);
}
