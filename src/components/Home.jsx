import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Loader,
  GradientTexture,
  Float,
  Wireframe,
} from "@react-three/drei";
import { Button3D } from "./ui-3d/button-3d";
import { Card3D } from "./ui-3d/card-3d";
import { Loader3D } from "./ui-3d/loader-3d";
import { Menu3D } from "./ui-3d/menu-3d";
import { Text } from "@react-three/drei";
import { ParticleSystem } from "./ui-3d/particle-system";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

function FloatingShape({ shape, position, color }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh position={position}>
        {/* Define Shape */}
        {shape === "box" && <boxGeometry args={[1, 2.5, 1.3,10]} />}
        {shape === "sphere" && <sphereGeometry args={[1, 32, 35]} />}
        {shape === "cone" && <coneGeometry args={[1, 1.7, 32]} />}
        {shape === "torus" && <torusGeometry args={[1.4, 0.2, 16, 100]} />}
        {shape === "cylinder" && <cylinderGeometry args={[1, 1, 1.6, 32]} />}
        {shape === "dodecahedron" && (
          <dodecahedronGeometry args={[1.5, 0, 1]} />
        )}
        {shape === "torus-knot" && <torusKnotGeometry />}
        {shape === "octahedron" && <octahedronGeometry args={[1,1,1,-1]} />}
        {/* Apply GradientTexture */}
        <meshStandardMaterial  wireframe>
          <GradientTexture
            attach="map"
            stops={[0, 1]}
            colors={["#FF5733", color]} 
            size={1024}
          />
        </meshStandardMaterial>
      </mesh>
    </Float>
  );
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="absolute top-10 right-4 z-10 flex gap-2"></div>

      <div className="w-full flex justify-center items-center h-screen">
        <Canvas
          className="bg-black"
          camera={{
            position: [1, 2, 8],
            fov: window.innerWidth < 768 ? 75 : 35,
          }}
        >
          <mesh>
            <GradientTexture attach="map" stops={[0, 1]} colors={["#00FF00"]} />
            <Suspense>
              <meshBasicMaterial wireframe="true" />
              <ComponentsShowcase />
            </Suspense>
          </mesh>

          <pointLight position={[0, 5, 0]} intensity={2} />

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </div>
      <div
        className=" absolute text-3xl cursor-pointer"
        onClick={() => navigate("/chatbot")}
      >
        Chatbot
      </div>
      <Loader />
    </main>
  );
}

function ComponentsShowcase() {
  const navigate = useNavigate();
  return (
    <group>
      {/* <Float position={[0, 0, 0]} speed={6} floatIntensity={0.1}> */}
      <Button3D
        position={[-1, -0.4  , 0]}
        onClick={() => navigate("/uploadModel")}
        label="Login"
        color={"#ed3b65"}
        hoverColor={"#7C3AED"}
      />
      <Button3D
        position={[0.8, -0.4  , 0]}
        onClick={() => navigate("/uploadModel")}
        label="Sign Up"
        color={"#ed3b65"}
        hoverColor={"#7C3AED"}
      />
      {/* <Menu3D
        position={[0, 2, 0]}
        items={[
          { label: "Home", value: "home" },
          { label: "3D shapes", value: "3D shapes" },
          { label: "3D Models", value: "3D Models" },
        ]}  
      /> */}

      <ambientLight intensity={2} />
      <ParticleSystem count={1000} color={"#fff"} size={0.15} speed={0.0005} />
      <Text
        position={[0, 0, 0]}
        fontSize={0.75}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        depthWrite={false}
      >
        Cross 3D
      </Text>
      {/* <Text
        position={[0, -1.3, 0]}
        fontSize={0.15}
        color="#00FF00"
        anchorX="center"
        anchorY="middle"
        depthWrite={false}
      >
        Refer to the documentation for more information
      </Text> */}
      <FloatingShape shape="box" position={[-4, 2.5, 0]} color="red" />
      <FloatingShape shape="sphere" position={[4, 2.7, 0]} color="blue" />
      <FloatingShape shape="cone" position={[-4, -2, 0]} color="green" />
      <FloatingShape shape="torus" position={[3, -3, 0]} color="purple" />
      <FloatingShape
        shape="cylinder"
        position={[-5.5, -0.5, -2]}
        color="orange"
      />
      <FloatingShape shape="dodecahedron" position={[4, 0, -2]} color="cyan" />
      <FloatingShape shape="torus-knot" position={[0, 2.7, -1 ]} color="yellow" />
      <FloatingShape shape="octahedron" position={[0, -2.5, -1 ]} color="yellow" />
      {/* </Float> */}
    </group>
  );
}
