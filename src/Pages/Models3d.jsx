import React from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { ParticleSystem } from "../components/ui-3d/particle-system";

const ModelThree = [
  "/models/airbus.glb",
  "/models/shiba.glb",
  "/models/blackhole.glb",
  "/models/angel_wings.glb",
  "/models/robo_obj_pose4.glb",
  "/models/sci-fi_vehicle.glb",
  "/models/fool_m416_tongue_motionpubgbgmi.glb",
  "/models/stylized_blade_valorant_style.glb",
  "/models/smoking_gun.glb",
];

const cameraPositions = {
  "/models/airbus.glb": [-5, 10, -40],
  "/models/shiba.glb": [0, 0, 2],
  "/models/blackhole.glb": [0, 2, 4],
  "/models/angel_wings.glb": [0, 2, 1],
  "/models/robo_obj_pose4.glb": [0, 3, 20],
  "/models/sci-fi_vehicle.glb": [10, 2, 0],
  "/models/fool_m416_tongue_motionpubgbgmi.glb": [0, 0, 1],
  "/models/stylized_blade_valorant_style.glb": [-2, 0, 2],
  "/models/smoking_gun.glb": [6, 6, -6],
};

const ShapeModel = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

const GetShapes = ({ shape }) => {
  const navigate = useNavigate();
  const cameraPosition = cameraPositions[shape] || [0, 2, 5];

  return (
    <div className="bg-[rgba(0,0,0,0.2)] rounded-xl p-4 shadow-lg flex flex-col items-center">
      <div className="border-2 border-blue-500 rounded-lg p-2">
        <Canvas camera={{ position: cameraPosition }} className="w-full h-40">
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Float speed={6} rotationIntensity={1} floatIntensity={2}>
            <ShapeModel path={shape} />
          </Float>

          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      <div className="flex w-full justify-between items-center mt-4">
        <p className="text-white text-sm mt-2">
          {shape.split("/")[2].split(".")[0].split("_").join(" ").toUpperCase()}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/customizemodel", { state: { shape } })}
            className="px-2 py-2 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Customize
          </button>

          <a
            href={shape}
            download
            className="px-2 py-2 bg-green-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-green-600 transition"
          >
            <i className="ri-download-line"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

const Models3D = () => {
  return (
    <div className="min-h-screen max-w-screen bg-gradient-to-b from-[#0D1B2A] via-[#0D1B2A] to-[#0D1B2A] flex flex-col items-center py-10">
      <h1 className="text-3xl text-white font-bold mb-8">3D Shapes Gallery</h1>

      <p className="text-xl text-center text-white">
        To use Models Simply download Model then click on customize button , customize Model and get
        Code!!!
      </p>
      <p className="text-2xl font-bold text-white">Happy Coding!!!</p>
      <div className="pointer-events-none absolute w-full h-screen">
        <Canvas className="absolute w-screen h-screen pointer-events-none">
          <ambientLight intensity={2} />
          <ParticleSystem
            count={1000}
            color={"#FFFFFF"}
            size={0.15}
            speed={0.0005}
          />
        </Canvas>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
        {ModelThree.map((shape, index) => (
          <GetShapes key={index} shape={shape} />
        ))}
      </div>
    </div>
  );
};

export default Models3D;