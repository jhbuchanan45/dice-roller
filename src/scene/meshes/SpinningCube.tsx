import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";

const isStopped = (rapierBody: RapierRigidBody, threshold: number) => {
  const velocity = rapierBody.linvel();
  const angularVelocity = rapierBody.angvel();

  return (
    Math.abs(velocity.x) < threshold &&
    Math.abs(velocity.y) < threshold &&
    Math.abs(velocity.z) < threshold &&
    Math.abs(angularVelocity.x) < threshold &&
    Math.abs(angularVelocity.y) < threshold &&
    Math.abs(angularVelocity.z) < threshold
  );
};

const SpinningCube = () => {
  const rapierBody = useRef<RapierRigidBody>(null!);

  const fling = useKeyboardControls((state) => {
    return state.fling;
  });

  useFrame(() => {
    if (!rapierBody.current) return;

    if (isStopped(rapierBody.current, 0.01)) {
      console.log(rapierBody.current.rotation());
    }
  });

  useEffect(() => {
    if (!rapierBody.current) return;

    if (fling) {
      rapierBody.current.applyImpulse({ x: 0, y: 700, z: 0 }, true);
      rapierBody.current.applyTorqueImpulse({ x: 150, y: 150, z: 150 }, true);
    }
  });

  return (
    <RigidBody ref={rapierBody} position-y={2} colliders="cuboid" density={4}>
      <mesh castShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
};

export default SpinningCube;
