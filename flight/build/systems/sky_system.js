import { Three } from './three_system.js';
import { BufferGeometryUtils } from '../utils/BufferGeometryUtils.js';
import { Color } from '../utils/utils.js';

let sky = null;

function createCloud() {
  let geom = null;

  const mat = new THREE.MeshPhongMaterial({
    color: Color.white,
    flatShading: true,
  });

  const blocks = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < blocks; i++) {
    const g = new THREE.BoxGeometry(20, 20, 20);
    
    g.rotateZ(Math.random() * Math.PI * 2);
    g.rotateY(Math.random() * Math.PI * 2);
    
    const s = 0.1 + Math.random() * 0.9;
    g.scale(s, s, s);
    g.translate(i * 15, Math.random() * 10, Math.random() * 10);


    if (geom === null) {
      geom = g;
    } else {
      geom = BufferGeometryUtils.mergeBufferGeometries([geom, g]);
    }
  }

  const cloud = new THREE.Mesh(geom, mat); 
  cloud.castShadow = true;
  cloud.receiveShadow = true;

  return cloud;
}

function createClouds() {
  sky = new THREE.Object3D();

  const n = 20;

  const stepAngle = Math.PI * 2 / n;

  for(let i = 0; i < n; i++) {
    const c = createCloud();
   
    const a = stepAngle * i; // this is the final angle of the cloud
    const h = 900 + Math.random() * 200; // this is the distance between the center of the axis and the cloud itself

    // Trigonometry!!! I hope you remember what you've learned in Math :)
    // in case you don't: 
    // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
    c.position.y = Math.sin(a) * h;
    c.position.x = Math.cos(a) * h;

    // rotate the cloud according to its position
    c.rotation.z = a + Math.PI / 2;

    // for a better result, we position the clouds 
    // at random depths inside of the scene
    c.position.z = -400 - Math.random() * 300;
    
    // we also set a random scale for each cloud
    const s = 1 + Math.random() * 2;
    c.scale.set(s, s, s);

    // do not forget to add the mesh of each cloud in the scene
    sky.add(c);
  }

  sky.position.y = -600;

  Three.scene.add(sky);
}

export default class SkySystem {
  init() {
    createClouds();
  }

  update() {
    sky.rotation.z += .01;
  }
};
