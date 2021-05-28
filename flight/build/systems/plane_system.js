import { Three } from './three_system.js';
import { Color, normalize } from '../utils/utils.js';
import { BufferGeometryUtils } from '../utils/BufferGeometryUtils.js';

const airplane = new THREE.Object3D();
const hairs = new THREE.Object3D();
let angleHairs = 0;
let propeller = null;
let cameraSway = 0;

function createAirplane() {
  // Create the engine
  const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
  const matEngine = new THREE.MeshPhongMaterial({ color: Color.white, flatShading: true });
  const engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;

  airplane.add(engine);
  
  // Create the cabin
  const geomCockpit = new THREE.CylinderGeometry(36, 16, 74, 4, 1);
  geomCockpit.applyMatrix4(new THREE.Matrix4().makeRotationZ(-Math.PI / 2));
  geomCockpit.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 4));

  geomCockpit.attributes.position.array[15 + 1] += 5;
  geomCockpit.attributes.position.array[24 + 1] += 0;
  geomCockpit.attributes.position.array[18 + 1] += 12;
  geomCockpit.attributes.position.array[21 + 1] += 12;
  
  // Create the tail
  const geomTail = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  geomTail.translate(-42, 20, 0);

  // Create the wing
  const geomWing = new THREE.BoxGeometry(30, 6, 150, 1, 1, 1);
  geomWing.translate(0, 16, 0);

  // Create the suspension in the back
  const geomSuspension = new THREE.BoxGeometry(4, 20, 4);
  geomSuspension.translate(0, 10, 0);
  geomSuspension.rotateZ(-0.3);
  geomSuspension.translate(-35, -10, 0);

  // Merge the body
  const matBody = new THREE.MeshPhongMaterial({ color: Color.red, flatShading: true });
  const body = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([geomCockpit, geomTail, geomWing, geomSuspension]),
    matBody,
  );

  body.position.x = -6;
  body.castShadow = true;
  body.receiveShadow = true;

  airplane.add(body);

  // wheels
  const wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
  wheelProtecGeom.translate(16, -20, 25);
  const wheelProtecGeomL = wheelProtecGeom.clone();
  wheelProtecGeomL.translate(0, 0, -50);

  const wheelProtecMat = new THREE.MeshPhongMaterial({ color: Color.red, flatShading: true });

  const wheelProtec = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([wheelProtecGeom, wheelProtecGeomL]),
    wheelProtecMat,
  );

  airplane.add(wheelProtec);

  const wheelTireGeom = new THREE.BoxGeometry(24, 24, 4);
  const wheelTireMat = new THREE.MeshPhongMaterial({ color: Color.brownDark, flatShading: true });
  const wheelTireR = new THREE.Mesh(wheelTireGeom, wheelTireMat);
  wheelTireR.position.set(16, -28, 25);

  airplane.add(wheelTireR);

  const wheelAxisGeom = new THREE.BoxGeometry(10, 10, 6);
  const wheelAxisMat = new THREE.MeshPhongMaterial({ color: Color.brown, flatShading: true });
  const wheelAxis = new THREE.Mesh(wheelAxisGeom, wheelAxisMat);
  wheelTireR.add(wheelAxis);

  const wheelTireL = wheelTireR.clone();
  wheelTireL.position.z = -wheelTireR.position.z;
  airplane.add(wheelTireL);

  const wheelTireB = wheelTireR.clone();
  wheelTireB.scale.set(0.5, 0.5, 0.5);
  wheelTireB.position.set(-41, -10, 0);
  airplane.add(wheelTireB);

  // propeller
  const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  const matPropeller = new THREE.MeshPhongMaterial({ color: Color.brown, flatShading: true });
  propeller = new THREE.Mesh(geomPropeller, matPropeller);
  propeller.castShadow = true;
  propeller.receiveShadow = true;

  propeller.position.set(50, 0, 0);
  airplane.add(propeller);
  
  // blades
  const geomBlade = new THREE.BoxGeometry(1, 80, 20, 1, 1, 1);
  geomBlade.translate(8, 0, 0);
  const geomBlade2 = geomBlade.clone();
  geomBlade2.rotateX(Math.PI / 2);

  const matBlade = new THREE.MeshPhongMaterial({ color: Color.brownDark, flatShading: true });
  
  const blades = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([geomBlade, geomBlade2]),
    matBlade,
  );
  
  blades.castShadow = true;
  blades.receiveShadow = true;
  
  propeller.add(blades);

  // Create windshield
  const geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
  const matWindshield = new THREE.MeshPhongMaterial({
    color: Color.white,
    transparent: true,
    opacity: 0.7,
    flatShading: true,
  });

  const windshield = new THREE.Mesh(geomWindshield, matWindshield);
  windshield.position.set(5, 27, 0);

  windshield.castShadow = true;
  windshield.receiveShadow = true;

  airplane.add(windshield);

  airplane.scale.set(0.25, 0.25, 0.25);
  airplane.position.y = 40;
  airplane.position.x = -100;

  Three.scene.add(airplane);
}

function createPilot() {
  const pilot = new THREE.Object3D();
  pilot.name = "pilot";

  // Body of the pilot
  const bodyGeom = new THREE.BoxGeometry(15, 15, 15);
  bodyGeom.translate(2, -12, 0);

  // Create the pilot glasses, combine with body to reduce drawcalls
  const glassGeom = new THREE.BoxGeometry(5, 5, 5);
  glassGeom.translate(6, 0, 3);
  const glassLGeom = glassGeom.clone();
  glassLGeom.translate(0, 0, -6);

  const glassAGeom = new THREE.BoxGeometry(11, 1, 11);

  // Create static hairs, combine with body
  // create the hairs at the side of the face
  const hairSideGeom = new THREE.BoxGeometry(12, 4, 2);
  hairSideGeom.translate(-3, 3, -6);
  const hairSideRGeom = new THREE.BoxGeometry(12, 4, 2);
  hairSideGeom.translate(0, 0, 12);

  // create the hairs at the back of the head
  const hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
  hairBackGeom.translate(-6, 1, 0);

  const bodyMat = new THREE.MeshPhongMaterial({ color: Color.brown, flatShading: true });
  const body = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([
      bodyGeom,
      glassGeom,
      glassLGeom,
      glassAGeom,
      hairSideGeom,
      hairSideRGeom,
      hairBackGeom
    ]),
    bodyMat
  );

  pilot.add(body);

  // Face of the pilot
  const faceGeom = new THREE.BoxGeometry(10, 10, 10);
  
  const earGeom = new THREE.BoxGeometry(2, 3, 2);
  earGeom.translate(0, 0, -6);

  const earRGeom = earGeom.clone();
  earRGeom.translate(0, 0, 12);

  const faceMat = new THREE.MeshLambertMaterial({ color: Color.pink });

  const face = new THREE.Mesh(
    BufferGeometryUtils.mergeBufferGeometries([faceGeom, earGeom, earRGeom]),
    faceMat,
  );

  pilot.add(face);

  // Hair element
  const hairGeom = new THREE.BoxGeometry(4, 4, 4);
  const hairMat = new THREE.MeshLambertMaterial({ color: Color.brown });
  const hair = new THREE.Mesh(hairGeom, hairMat);
  // Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  hair.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 2, 0));
  
  // create the hairs at the top of the head 
  // and position them on a 3 x 4 grid
  for (let i=0; i<12; i++){
    const h = hair.clone();
    const col = i%3;
    const row = Math.floor(i/3);
    const startPosZ = -4;
    const startPosX = -4;

    h.position.set(startPosX + row*4, 0, startPosZ + col*4);

    hairs.add(h);
  }

  hairs.position.set(-5,5,0);

  pilot.add(hairs);

  pilot.position.set(-10, 27, 0);

  airplane.add(pilot);
}

let mousePos = { x: 0, y: 0};

function handleMouseMove(event) {
  // here we are converting the mouse position value received 
  // to a normalized value varying between -1 and 1;
  // this is the formula for the horizontal axis:
  const tx = -1 + (event.clientX / window.innerWidth) * 2;

  // for the vertical axis, we need to inverse the formula 
  // because the 2D y-axis goes the opposite direction of the 3D y-axis
  const ty = 1 - (event.clientY / window.innerHeight) * 2;
  mousePos.x = tx; 
  mousePos.y = ty;
}

export default class PlaneSystem {
  init() {
    createAirplane();
    createPilot();

    document.addEventListener('mousemove', handleMouseMove, false);
  }

  update() {
    propeller.rotation.x += 0.3;

    const targetY = normalize(mousePos.y, -0.75, 0.75, 30, 175);
    const targetX = normalize(mousePos.x, -0.75, 0.75, -100, 100);

    airplane.position.y += (targetY - airplane.position.y) * 0.1;
    airplane.rotation.z = (targetY - airplane.position.y) * 0.0128;
    airplane.rotation.x = (airplane.position.y - targetY) * 0.0128;

    airplane.rotation.x += normalize(Math.sin(cameraSway), -1, 1, -0.2, 0.2);
    airplane.rotation.z += normalize(Math.sin(cameraSway / 2), -1, 1, -0.02, 0.1);

    const hair = hairs.children;

    const l = hair.length;
    for (let i = 0; i < l; i++){
      const h = hair[i];

      h.scale.y = 0.75 + Math.cos(angleHairs + i / 3) * 0.25;
    }

    angleHairs += 0.16;

    // const camera = Three.camera;
    // camera.fov = normalize(mousePos.x, -1, 1, 50, 70);
    // camera.fov = normalize(Math.sin(cameraSway), -1, 1, 55, 65);
    // camera.updateProjectionMatrix();

    cameraSway += 0.008;
  }
};
