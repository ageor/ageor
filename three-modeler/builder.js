// import {
//   SphereGeometry,
//   BoxGeometry,
//   IcosahedronGeometry,
//   CylinderGeometry,
//   ExtrudeGeometry,
//   Color,
//   Mesh,
//   MeshPhongMaterial,
//   Shape,
//   Object3D,
// } as THREE from './three.js';

import * as THREE from './three.js';
import { BufferGeometryUtils } from "https://threejs.org/examples/jsm/utils/BufferGeometryUtils.js";

// import { BufferGeometryUtils } from "./bgu.js";

function buildShape(points) {
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
  
  return shape;
}

export function buildModel(data) {
  let geometry = null;
  let extrudes = null;
  let colors = {};

  for (let color in data.colors) {
    colors[color] = new THREE.Color(data.colors[color]);
  }

  for (let g in data.geometries) {
    const dg = data.geometries[g];

    if (dg.type === 'extrude') {
      dg.shape = buildShape(dg.points);
    }

    let geom = constructGeometry(dg.type, dg).toNonIndexed();

    geom.scale(dg.sx, dg.sy, dg.sz);
    geom.rotateZ(dg.rz);
    geom.rotateY(dg.ry);
    geom.rotateX(dg.rx);
    geom.translate(dg.x, dg.y, dg.z);

    if (dg.MirrorX) {
      const original = geom;
      const mirror = constructGeometry(dg.type, dg).toNonIndexed();

      mirror.scale(dg.sx, dg.sy, dg.sz);

      mirror.rotateZ(-dg.rz);
      mirror.rotateY(-dg.ry);
      mirror.rotateX(dg.rx);
      mirror.translate(-dg.x, dg.y, dg.z);

      geom = BufferGeometryUtils.mergeBufferGeometries([original, mirror]);
    }

    const col = new THREE.Color(colors[dg.Color]);
    const colCount = geom.attributes.position.count;
    const c = new Float32Array(colCount * 3);
    for (let i = 0; i < colCount; i++) {
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }

    geom.setAttribute( 'color', new THREE.BufferAttribute( c, 3 ) );    

    geometry = geometry
      ? BufferGeometryUtils.mergeBufferGeometries([geometry, geom])
      : geom;
  }

  const mat = new THREE.MeshPhongMaterial({ color: '#ffffff', flatShading: true, vertexColors: true });
  const mesh = new THREE.Mesh(geometry, mat);

  mesh.position.y = 2;

  return mesh;
}

export function constructGeometry(type, opts) {
  switch (type) {
    case 'sphere':
      return new THREE.SphereGeometry(opts.Radius, opts.WSeg, opts.HSeg);
      break;
    case 'box':
      return new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'ico':
      return new THREE.IcosahedronGeometry(opts.Radius, opts.Detail);
      break;
    case 'cylinder':
      return new THREE.CylinderGeometry(opts.RadiusTop, opts.RadiusBottom, 1, opts.RadialSegments);
      break;
    case 'extrude':
      return new THREE.ExtrudeGeometry(opts.shape, {
        steps: opts.steps,
        depth: opts.Depth,
        bevelEnabled: opts.Bevel,
        bevelThickness: opts.BevelThickness,
        bevelSize: opts.BevelSize,
        bevelOffset: opts.BevelOffset,
        bevelSegments: opts.BevelSegments,
      });
      break;
  }
}
