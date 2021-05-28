import { Three } from './three_system.js';
import { ParticleSystem as PS, PointEmitter, PointField, GlobalField } from '../utils/particle_system.js';
import { deltaTime, currentTime } from './time_system.js';

const g = new THREE.IcosahedronGeometry(1);
// const g = new THREE.BoxGeometry(1, 1, 1);
const n = new PS(2000, g);

const scale = { p: 1 };
const scaleCurve = gsap.timeline({ paused: true });
scaleCurve.to(scale, { duration: 0.1, ease: 'expo.in', p: 0 });
scaleCurve.to(scale, { duration: 0.2, ease: 'expo.in', p: 1 }, '+=1');

const baseEmitter = {
  pos: {
    x: 0,
    y: 40,
    z: 0,
  },
  vel: {
    x: 50,
    y: 0,
    z: 0,
  },
  spread: {
    x: 60,
    y: 60,
    z: 30,
  },
  emissionRate: 100,
  startSize: 6,
  endSize: 0,
  ttl: 3,
  scaleFunction: t => {
    scaleCurve.progress(t);

    return scale.p;
  }
};

export default class ParticleSystem {
  init() {
    const emitter = new PointEmitter(baseEmitter);

    n.addEmitter(emitter);

    // n.addField(
    //   new GlobalField({
    //     dir: { x: 0, y: -98, z: 0 },
    //   })
    // );

    n.addField(
      new PointField({
        pos: {
          x: 10,
          y: 100,
          z: 0,
        },
        size: 50,
        mass: 40,
      })
    );

    n.addField(
      new PointField({
        pos: {
          x: 30,
          y: 60,
          z: 0,
        },
        size: 50,
        mass: 30,
      })
    );

    n.init();

    Three.scene.add(n.mesh);
    // n.mesh.position.y = 40;
    // console.log(n.mesh);

    // document.addEventListener('click', handleMouseMove, false);
  }

  update() {
    n.update(deltaTime());
  }
};
