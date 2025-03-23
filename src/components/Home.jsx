import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import { Button3D } from "./ui-3d/button-3d";
import { Card3D } from "./ui-3d/card-3d";
import { Loader3D } from "./ui-3d/loader-3d";
import { Menu3D } from "./ui-3d/menu-3d";
import { Stars } from "@react-three/drei";
import UploadModel from "./../Pages/UploadModel";
import * as THREE from "three";
import { ParticleSystem } from "./ui-3d/particle-system";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="absolute top-10 right-4 z-10 flex gap-2"></div>

      <div className="w-full flex justify-center items-center h-screen">
        <Canvas camera={{ position: [1, 1, 4], fov: 60 }}>
          <color attach="background" args={["#000"]} />

          <pointLight position={[0, 5, 0]} intensity={2} />
          <Suspense>
            <ComponentsShowcase />
          </Suspense>

          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={10}
          />
        </Canvas>
      </div>
      <Loader />
    </main>
  );
}

function ComponentsShowcase({ onShowModelViewer }) {
  const navigate = useNavigate();
  return (
    <group>
      <Button3D
        position={[-2, 0.5, 0]}
        onClick={() => navigate("/uploadModel")}
        label="Open Model Viewer"
        color={"#4C1D95"}
        hoverColor={"#7C3AED"}
      />
      <Menu3D
        position={[0, 2, 0]}
        items={[
          { label: "Home", value: "home" },
          { label: "3D shapes", value: "3D shapes" },
          { label: "3D Models", value: "3D Models" },
        ]}
      />
      <Card3D
        position={[0, 0.5, 0]}
        rotation={[0, 0, 0]}
        width={1.5}
        height={1}
        depth={0.1}
        color={"#F1F5F9"}
        title="3D Card"
        content="Interactive 3D card with hover effects"
      />

      <Loader3D
        position={[2, 0.5, 0]}
        size={0.5}
        speed={1.5}
        color={"#DB2777"}
      />
      <ParticleSystem count={1000} color={"#fff"} size={0.15} speed={0.0005} />
    </group>
  );
}