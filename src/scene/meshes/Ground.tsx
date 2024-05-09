import { RigidBody } from "@react-three/rapier";
import React from "react";

const Ground = () => {
  return (
    <RigidBody
      type="fixed"
      position-y={-0.1 / 2}
      rotation={[-Math.PI / 2, 0, 0]}
      colliders="cuboid"
    >
      <mesh receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>
    </RigidBody>
  );
};

export default Ground;
