import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import { BoxGeometry, Mesh } from "three";
import * as THREE from "three";

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
  // const geometry = useMemo(() => new BoxGeometry(3, 3, 3), []).toNonIndexed();
  const geometry = useMemo(
    () => new THREE.OctahedronGeometry(3),
    []
  ).toNonIndexed();
  const meshRef = useRef<Mesh>(null!);

  geometry.clearGroups();

  let faces = geometry.attributes.position.count / 3;
  let groupStart = 0;
  for (let i = 0; i < faces; i++) {
    geometry.addGroup(groupStart, 3, i);
    groupStart += 3;
  }

  const material = useMemo(
    () =>
      Array(faces)
        .fill(0)
        .map(() => new THREE.MeshStandardMaterial({ color: "blue" })),
    [faces]
  );

  const fling = useKeyboardControls((state) => {
    return state.fling;
  });

  useFrame(() => {
    if (!rapierBody.current) return;

    if (isStopped(rapierBody.current, 0.01)) {
      const worldPositions =
        meshRef.current.geometry.attributes.position.clone();

      worldPositions.applyMatrix4(meshRef.current.matrixWorld);

      // go through each group and check the position of the centre
      const facePositions = meshRef.current.geometry.groups.map((group) => {
        const groupVertices = worldPositions.array.slice(
          group.start * 3,
          (group.start + group.count) * 3
        );

        const avg = new THREE.Vector3();

        for (let i = 0; i < groupVertices.length; i += 3) {
          avg.add(
            new THREE.Vector3(
              groupVertices[i],
              groupVertices[i + 1],
              groupVertices[i + 2]
            )
          );
        }

        avg.divideScalar(group.count);

        return avg;
      });

      // for the highest position, set the material to red
      let highestIndex = 0;
      for (let i = 1; i < facePositions.length; i++) {
        if (facePositions[i].y > facePositions[highestIndex].y) {
          highestIndex = i;
        }
      }

      material[highestIndex].color.set("red");
    } else {
      material.forEach((mat) => {
        mat.color.set("blue");
      });
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
    <RigidBody ref={rapierBody} position-y={2} colliders="trimesh" density={4}>
      <mesh
        castShadow
        ref={meshRef}
        geometry={geometry}
        material={material}
      ></mesh>
    </RigidBody>
  );
};

export default SpinningCube;
