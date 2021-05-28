// Particle size
const P =
  + 3 // position
  + 2 // size (start/end)
  + 3 // velocity
  + 3 // field acceleration
  + 1 // time to live
  + 1 // age (life)
  + 1; // emitter index

const X = 0,
      Y = 1,
      Z = 2,
      S0 = 3,
      S1 = 4,
      VX = 5,
      VY = 6,
      VZ = 7,
      AX = 8,
      AY = 9,
      AZ = 10,
      TTL = 11,
      AGE = 12,
      EI = 13;

let P_COUNT = 0,
    P_MEM = null,
    PS = null,
    FIELDS = null,
    EMITTERS = null,
    P_OPA = null,
    MESH = null;

// function findFreeParticle() {
//   for (let i = 0; i < particles; i++) {
//     if (P_MEM[i * P + TTL] === -1) return i;
//   }

//   return -1;
// }

function emitParticles(i, dt) {
  if (PS.liveParticles >= PS.particles) return;

  const E = EMITTERS[i];

  const availableParticles = PS.particles - PS.liveParticles;

  const dtS = dt / 1000;
  E.emit += E.emissionRate * dtS;

  for (let n = 0; n < E.emit && n < availableParticles; n++) {
    E.emit--;

    const I = ++PS.nextParticle % PS.particles * P;
    P_MEM[I + X] = E.pos.x;
    P_MEM[I + Y] = E.pos.y;
    P_MEM[I + Z] = E.pos.z;

    P_MEM[I + VX] = E.vel.x + E.spread.x * (Math.random() - 0.5);
    P_MEM[I + VY] = E.vel.y + E.spread.y * (Math.random() - 0.5);
    P_MEM[I + VZ] = E.vel.z + E.spread.z * (Math.random() - 0.5);

    P_MEM[I + S0] = E.startSize;
    P_MEM[I + S1] = E.endSize;

    P_MEM[I + TTL] = E.ttl;

    P_MEM[I + AGE] = 0;

    P_MEM[I + EI] = i;

    PS.liveParticles++;
  }
}

function applyFields(I) {
  P_MEM[I + AX] = 0;
  P_MEM[I + AY] = 0;
  P_MEM[I + AZ] = 0;

  for (let f of FIELDS) {
    f.apply(I);
  }
}

function init(P_COUNT, P_OPA, P_GEOMETRY) {
  const geom = new THREE.InstancedBufferGeometry().copy(P_GEOMETRY);

  geom.setAttribute(
    "aAlpha",
    new THREE.InstancedBufferAttribute(P_OPA, 1, false)
  );

  const mat = new THREE.MeshPhongMaterial({
    color: 0x68c3c0,
    // color: 0xff0000,
    flatShading: true,
    transparent: true,
    // depthWrite: false,
    // opacity: 0.5,
    onBeforeCompile: (shader) => {
      shader.vertexShader =
        shader.vertexShader
          .replace("varying vec3 vViewPosition;", "varying vec3 vViewPosition;\nattribute float aAlpha;\nvarying float vAlpha;")
          .replace("main() {", "main() {\n\tvAlpha = aAlpha;");

      shader.fragmentShader =
        shader.fragmentShader
          .replace("uniform vec3 diffuse;", "uniform vec3 diffuse; in float vAlpha;")
          .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse, vAlpha );");
      
      // uniforms go here shader.uniforms

      // console.log(shader);
    }
  });

  const mesh = new THREE.InstancedMesh(geom, mat, P_COUNT);

  const matrix = new THREE.Matrix4();
  // const color = new THREE.Color(0xf7d9aa);
  for (let i = 0; i < P_COUNT; i++) {
    // matrix.setPosition( 0, 0, 0 );
    matrix.makeScale(0, 0, 0);

    mesh.setMatrixAt(i, matrix);
    // mesh.setColorAt( i, color );
  }

  // mesh.castShadow = true;

  // mesh.setColorAt(0, new THREE.Color(0xff0000));
  // opa[0] = 0.1;

  return mesh;
}

function updateParticles(dt) {
  const dtS = dt / 1000;

  const matrix = new THREE.Matrix4();
  let expiredParticles = 0;

  // TODO figure this out... sort then update?
  // find free, find last, swap until free >= last
  // mesh.count = liveParticles;

  // const sorters = new Array(P_COUNT);
  // function sorter(offset) {
  //   // z sorting
  //   const val = P_MEM[offset * P + Z];
  //   return {
  //     val,
  //     offset,
  //   };
  // }

  // function updateSorters() {
  //   for (let i = 0; i < P_COUNT; i++) {
  //     sorters[i] = sorter(i);
  //   } 
  // }

  // // const reorderCache = new Array(P);
  // function reorder(order) {
  //   for (let i = 0; i < P_COUNT; i++) {
  //     const { offset } = order[i];
  //     const I = i * P;
  //     const oI = offset * P;

  //     for (let j = 0; j < P; j++) {
  //       const tmp = P_MEM[I + j];
  //       P_MEM[I + j] = P_MEM[oI + j];
  //       P_MEM[oI + j] = tmp; 
  //     }
  //   }
  // }

  // updateSorters();

  // const order = sorters.sort((a, b) => b.val - a.val);
  
  // reorder(order);

  for (let i = 0; i < P_COUNT; i++) {
    const I = i * P;
    if (P_MEM[I + TTL] === -1) continue;

    applyFields(I);

    const p = P_MEM[I + AGE] / P_MEM[I + TTL];

    // P_OPA[i] = 1 - p;

    P_MEM[I + VX] += (P_MEM[I + AX]) * dtS;
    P_MEM[I + VY] += (P_MEM[I + AY]) * dtS;
    P_MEM[I + VZ] += (P_MEM[I + AZ]) * dtS;

    // vel[idx] = Math.max(Math.min(vel[idx], maxVelocity), -maxVelocity);
    // vel[idx + 1] = Math.max(Math.min(vel[idx + 1], maxVelocity), -maxVelocity);
    // vel[idx + 2] = Math.max(Math.min(vel[idx + 2], maxVelocity), -maxVelocity);

    P_MEM[I + X] += P_MEM[I + VX] * dtS;
    P_MEM[I + Y] += P_MEM[I + VY] * dtS;
    P_MEM[I + Z] += P_MEM[I + VZ] * dtS;

    // Inline matrix setters, because we know what we're doing
    const sp = EMITTERS[P_MEM[I + EI]].scaleFunction(p);
    const scale = (1 - sp) * P_MEM[I + S0] + sp * P_MEM[I + S1];
    matrix.elements[0] = matrix.elements[5] = matrix.elements[10] = scale;

    matrix.elements[12] = P_MEM[I + X];
    matrix.elements[13] = P_MEM[I + Y];
    matrix.elements[14] = P_MEM[I + Z];

    P_MEM[I + AGE] += dtS;

    if (P_MEM[I + TTL] < P_MEM[I + AGE]) {
      P_MEM[I + TTL] = -1;
      P_MEM[I + AGE] = 0;
      expiredParticles++;
      matrix.elements[0] = matrix.elements[5] = matrix.elements[10] = 0;
    }

    MESH.setMatrixAt(i, matrix);
    MESH.instanceMatrix.needsUpdate = true;
    MESH.geometry.attributes.aAlpha.needsUpdate = true
    // mesh.instanceColor.needsUpdate = true;
  }

  return expiredParticles;
}

const defaultVec = { x: 0, y: 0, z: 0};
const defaultScale = t => t;
class PointEmitter {
  constructor(props) {
    this.pos = props.pos || { ...defaultVec };
    this.vel = props.vel || { ...defaultVec };
    this.acc = props.acc || { ...defaultVec };
    this.spread = props.spread || { ...defaultVec };
    this.emissionRate = props.emissionRate || 0;
    this.startSize = props.startSize || 0;
    this.endSize = props.endSize || 0;
    this.ttl = props.ttl || 0;
    this.emit = 0;
    this.scaleFunction = props.scaleFunction || defaultScale;
  }
}

class GlobalField {
  constructor(props) {
    this.dir = props.dir;
  }

  apply(I) {
    P_MEM[I + AX] += this.dir.x;
    P_MEM[I + AY] += this.dir.y;
    P_MEM[I + AZ] += this.dir.z;
  }
}

class PointField {
  constructor(props) {
    this.pos = props.pos || { ...defaultVec };
    this.size = props.size || 0;
    this.mass = props.mass || 0;

    // const geometry = new THREE.SphereGeometry( 1, 32, 32 );
    // const material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent: true, opacity: 0.2} );
    // const cube = new THREE.Mesh( geometry, material );
    // cube.position.set(fPos[i * 3], fPos[i * 3 + 1] + 40, fPos[i * 3 + 2]);
    // Three.scene.add( cube );
  }

  apply(I) {
    const dx = this.pos.x - P_MEM[I + X];
    const dy = this.pos.y - P_MEM[I + Y];
    const dz = this.pos.z - P_MEM[I + Z];

    // const p = 1 - (dx * dx + dy * dy + dz * dz) / (f.size * f.size);
    const d =
      dx * dx
      + dy * dy
      + dz * dz
      + this.mass;

    const force = 67.7 * this.mass / d;// * Math.max(p, 0);

    P_MEM[I + AX] += dx * force;
    P_MEM[I + AY] += dy * force;
    P_MEM[I + AZ] += dz * force;
  }
}

function load(ps) {
  MESH = ps.mesh;
  PS = ps;
  P_COUNT = ps.particles;
  P_MEM = ps.memory;
  FIELDS = ps.fields;
  P_OPA = ps.opacity;
  EMITTERS = ps.emitters;
}

function unload() {
  MESH = null;
  PS = null;
  P_COUNT = 0;
  P_MEM = null;
  FIELDS = null;
  P_OPA = null;
  EMITTERS = null;
}

class ParticleSystem {
  constructor(maxParticles, geometry) {
    this.particles = maxParticles;
    this.liveParticles = 0;
    this.particleTTL = 0;
    this.memory = null;
    this.mesh = null;
    this.opacity = null;
    this.emitters = [];
    this.fields = [];
    this.nextParticle = -1;
    this.geometry = geometry;
  }

  addEmitter(emitter) {
    this.emitters.push(emitter);
  }

  addField(field) {
    this.fields.push(field);
  }

  update(dt) {
    load(this);

    this.liveParticles -= updateParticles(dt);

    for (let i = 0; i < this.emitters.length; i++) {
      emitParticles(i, dt);
    }

    // console.log(this.memory);
    // console.log(this.memory[0 + TTL], this.memory[0 + AGE]);

    unload();
  }

  init() {
    this.memory = new Float32Array(this.particles * P).fill(-1);
    this.opacity = new Float32Array(this.particles).fill(1);
    this.mesh = init(this.particles, this.opacity, this.geometry);

    this.geometry.dispose();
  }
};

export { ParticleSystem, PointEmitter, PointField, GlobalField };
