import React, { Suspense, useMemo, useRef } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import SpinningCube from "./scene/meshes/SpinningCube";
import Ground from "./scene/meshes/Ground";
import { Physics } from "@react-three/rapier";
import { KeyboardControlsEntry, OrbitControls } from "@react-three/drei";
import { KeyboardControls } from "@react-three/drei";

function App() {
  const threeCamera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  threeCamera.position.set(5, 5, 5);

  const map = useMemo<KeyboardControlsEntry[]>(
    () => [{ name: "fling", keys: ["Space"] }],
    []
  );

  return (
    <div className="App">
      <div style={{ width: "100%", height: "100%" }}>
        <KeyboardControls map={map}>
          <Canvas camera={threeCamera}>
            <Suspense>
              <Physics gravity={[0, -10, 0]} debug>
                <ambientLight intensity={0.1} color="white" />
                <directionalLight
                  color="white"
                  position={[10, 8, 10]}
                  intensity={0.6}
                />
                <SpinningCube />
                <Ground />
              </Physics>
            </Suspense>
            <OrbitControls />
          </Canvas>
        </KeyboardControls>
      </div>
    </div>
  );
}

export default App;
