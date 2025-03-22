import React from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

const ModelThree = [
  "/models/airbus.glb",
  "/models/shiba.glb"
];

const cameraPositions = {
  "/models/airbus.glb": [-5, 10, -40], 
  "/models/shiba.glb": [0, 0, 2],
};

const ShapeModel = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
};

const GetShapes = ({ shape }) => {
  const navigate = useNavigate();
  const cameraPosition = cameraPositions[shape] || [0, 2, 5]; // Default position if not specified

  return (
    <div className="bg-transparent rounded-xl p-4 shadow-lg flex flex-col items-center">
      <div className="border-2 border-blue-500 rounded-lg p-2">
        <Canvas camera={{ position: cameraPosition }} className="w-full h-40">
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <Float size={0.5} position={[0, 1, 0]} />
          <ShapeModel path={shape} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      <div className="flex w-full justify-between items-center mt-4">
        <p className="text-white text-sm mt-2">{shape.toUpperCase()}</p>
        <button
          onClick={() => navigate("/customize", { state: { shape } })}
          className="px-2 py-2 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Customize
        </button>
      </div>
    </div>
  );
};

const Models3D = () => {
  return (
    <div className="min-h-screen max-w-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center py-10">
      <h1 className="text-3xl text-white font-bold mb-8">3D Shapes Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
        {ModelThree.map((shape, index) => (
          <GetShapes key={index} shape={shape} />
        ))}
      </div>
    </div>
  );
};

export default Models3D;
