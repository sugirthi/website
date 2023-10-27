import * as THREE from "three";
import { useRef } from "react";
import Ambient from "../Light/ambient";

import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import SimplexNoise from "simplex-noise";
const blobScale = 6;
const noise = new SimplexNoise();

export default function Nucleus() {
  const texturenucleus = useLoader(
    TextureLoader,
    "https://i.ibb.co/mTR46MX/dat.jpg"
    // "https://i.ibb.co/5kFytqr/bg2.jpg"
    // "https://i.ibb.co/CnJ5Fhy/gray-galaxy.jpg"
  );

  texturenucleus.anisotropy = 8;

  const nucleusMesh = useRef();

  useFrame(({}) => {
    let geometry = nucleusMesh.current.geometry;
    let positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    let time = Date.now();
    for (let i = 0; i < positionAttribute.count; i++) {
      const v = vertex.fromBufferAttribute(positionAttribute, i);

      v.normalize();

      let distance =
        geometry.parameters.radius +
        noise.noise3D(
          v.x + time * 0.0005,
          v.y + time * 0.0003,
          v.z + time * 0.0008
        ) *
          blobScale;
      v.multiplyScalar(distance);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;
    positionAttribute.normalsNeedUpdate = true;
    geometry.computeVertexNormals();

    nucleusMesh.current.rotation.y -= 0.005;
  });

  return (
    <mesh ref={nucleusMesh} position={new THREE.Vector3(1, 1, 1)}>
      <icosahedronGeometry args={[30, 10]} />
      <Ambient />
      <meshPhongMaterial
        side={THREE.BackSide}
        map={texturenucleus}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
