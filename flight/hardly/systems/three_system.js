const Three = {
  scene: null,
  camera: null,
  renderer: null,
};

function createScene() {
  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
  // scene.fog = new THREE.Fog(0x3597d3, 100, 950);

  const aspectRatio = WIDTH / HEIGHT;
  const fov = 60;
  const near = 1;
  const far = 10000;

  const camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    near,
    far
  );

  camera.position.x = 0;
  camera.position.y = 100;
  camera.position.z = 200;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  const container = document.querySelector('.container');
  container.appendChild(renderer.domElement);

  Three.scene = scene;
  Three.camera = camera;
  Three.renderer = window.renderer = renderer;

  window.addEventListener('resize', function() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }, false);
}

function createLights() {
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

  const directionalLight = new THREE.DirectionalLight(0xffffff, .9);
  directionalLight.position.set(150, 350, 350);
  directionalLight.castShadow = true;

  directionalLight.shadow.camera.left = -400;
  directionalLight.shadow.camera.right = 400;
  directionalLight.shadow.camera.top = 400;
  directionalLight.shadow.camera.bottom = -400;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 1000;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  const ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  Three.scene.add(ambientLight);
  Three.scene.add(hemisphereLight);  
  Three.scene.add(directionalLight);
}

// import { liveParticles } from './particle_system.js';
const stats = window.stats = new Stats();
const DC = stats.addPanel(new Stats.Panel('DC', '#fff', '#444'));
// const Particles = stats.addPanel(new Stats.Panel('P', '#fff', '#444'));
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.domElement);

export default class ThreeSystem {
  init() {
    createScene();
    createLights();
  }

  update() {
    Three.renderer.render(Three.scene, Three.camera);
    stats.update();
    // stats.begin();
    DC.update(Three.renderer.info.render.calls);
    // Particles.update(liveParticles, 30000);
    // stats.end();
  }
};

export { Three };
