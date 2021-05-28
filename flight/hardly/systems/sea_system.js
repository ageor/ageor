import { Three } from './three_system.js';
import { BufferGeometryUtils } from '../utils/BufferGeometryUtils.js';
import { Color } from '../utils/utils.js';

let seaMesh = null;
const waves = [];

function createSea() {
  const geom = BufferGeometryUtils.mergeVertices(new THREE.CylinderGeometry(800, 800, 800, 40, 4), 10);

  geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  
  const mat = new THREE.MeshPhongMaterial({
    color: Color.blue,
    // color: 0x005f2f,
    transparent: true,
    opacity: 0.8,
    // opacity: 1,
    flatShading: true,
  });

  const mesh = new THREE.Mesh(geom, mat);

  mesh.position.z = -300;
  mesh.position.y = -800;

  mesh.receiveShadow = true;

  const seaObj = new THREE.Object3D();
  seaObj.add(mesh);

  Three.scene.add(seaObj); 

  seaMesh = mesh;

  let l = geom.attributes.position.count;

  for (let i = 0; i < l; i++) {
    let v = geom.attributes.position.array;
    const x = i * 3;

    waves.push({
      y: v[x + 1],
      x: v[x],
      z: v[x + 2],
      ang: Math.random() * Math.PI * 2,
      amp: 5 + Math.random() * 15,
      speed: 0.016 + Math.random() * 0.032,
    });
  };
}

export default class SeaSystem {
  init() {
    createSea();

    console.log(Three);
  }

  update() {
    // get the vertices
    const verts = seaMesh.geometry.attributes.position.array;
    const l = seaMesh.geometry.attributes.position.count;
    
    for (let i = 0; i < l; i++){
      // get the data associated to it
      const vprops = waves[i];
      const x = i * 3;
      
      // update the position of the vertex
      verts[x] = vprops.x + Math.cos(vprops.ang) * vprops.amp;
      verts[x + 1] = vprops.y + Math.sin(vprops.ang) * vprops.amp;

      // increment the angle for the next frame
      vprops.ang += vprops.speed;
    }

    seaMesh.geometry.attributes.position.needsUpdate = true;

    seaMesh.rotation.z += .005;
  }
}