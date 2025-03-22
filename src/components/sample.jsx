import React, { useRef, useState, useEffect } from "react";
      import { Canvas, useThree } from "@react-three/fiber";
      import { useGLTF, OrbitControls } from "@react-three/drei";

      function Model() {
        const modelRef = useRef();

        useEffect(() => {
          if (modelRef.current) {
            modelRef.current.scale.set(3.0988, 3.0988, 3.0988);
            modelRef.current.rotation.set(1.99176974237593, 2.60752190247953, 0);
            modelRef.current.position.set(0, 0, 0);
            modelRef.current.traverse((child) => {
              if (child.isMesh) {
                child.material.color.set('#c70fc1');
              }
            });
          }
        }, []);

        return <mesh ref={modelRef}>
    <boxGeometry/>
  </mesh>
      }

      function CameraController({ fov }) {
        const { camera } = useThree();

        useEffect(() => {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }, [fov]);

        return null;
      }

      function Scene() {
        return (
          <div  style={{position:"absolute",height:"100vh",width:"100vw",inset:"0"}}>
            <Canvas camera={{ fov: 51.87, position: [0, 0, 10] }}>
              <CameraController fov={51.87} />
              <ambientLight intensity={2} />
              <pointLight position={[10, 10, 10]} />
              <Model  />
              <OrbitControls />
            </Canvas>
          </div>
        );
      }

      export default Scene;