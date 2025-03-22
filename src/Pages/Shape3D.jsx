import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { ParticleSystem } from "../components/ui-3d/particle-system";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
const ShapeThree = [
  "box",
  "sphere",
  "plane",
  "circle",
  "cone",
  "cylinder",
  "torus",
  "torus-knot",
  "dodecahedron",
  "icosahedron",
  "octahedron",
  "tetrahedron",
  "ring",
  "capsule",
];

const GetShapes = (shape) => {
  let geometry;
  const navigate = useNavigate();

  switch (shape.shape.toLowerCase()) {
    case "box":
      geometry = <boxGeometry args={[2, 2, 2]} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[1.5, 32, 32]} />;
      break;
    case "plane":
      geometry = <planeGeometry args={[4, 4]} />;
      break;
    case "circle":
      geometry = <circleGeometry args={[2, 32]} />;
      break;
    case "cone":
      geometry = <coneGeometry args={[1.5, 3, 32]} />;
      break;
    case "cylinder":
      geometry = <cylinderGeometry args={[1, 1, 3, 32]} />;
      break;
    case "torus":
      geometry = <torusGeometry args={[1, 0.4, 16, 100]} />;
      break;
    case "torus-knot":
      geometry = <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      break;
    case "dodecahedron":
      geometry = <dodecahedronGeometry args={[1.5]} />;
      break;
    case "icosahedron":
      geometry = <icosahedronGeometry args={[1.5]} />;
      break;
    case "octahedron":
      geometry = <octahedronGeometry args={[1.5]} />;
      break;
    case "tetrahedron":
      geometry = <tetrahedronGeometry args={[1.5]} />;
      break;
    case "ring":
      geometry = <ringGeometry args={[1, 2, 32]} />;
      break;
    case "capsule":
      geometry = <capsuleGeometry args={[1, 2, 8, 16]} />;
      break;
    default:
      geometry = <boxGeometry args={[2, 2, 2]} />;
  }

  return (
    <div className="bg-transparent rounded-xl p-4 shadow-lg flex flex-col items-center">
      <div className="border-2 border-blue-500 rounded-lg p-2 ">
        <Canvas camera={{ position: [3, 3, 3] }} className="w-full h-40">
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 2, 2]} />
          <mesh >
            {geometry}
            <meshStandardMaterial side={THREE.DoubleSide} color="royalblue" />
          </mesh>
          <OrbitControls />
        </Canvas>
      </div>

      <div className="flex w-full justify-between items-center mt-4">
        {" "}
        <p className="text-white text-sm mt-2">{shape.shape.toUpperCase()}</p>
        <button onClick={()=>navigate("/customizeshape",{state:{shape:shape.shape}})} className="px-2 py-2 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-600 transition">
          Customize
        </button>
      </div>
    </div>
  );
};

const Shape3D = () => {
  return (
    <div className="min-h-screen max-w-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center py-10">
      <h1 className="text-3xl text-white font-bold mb-8">3D Shapes Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 p-4">
        {ShapeThree.map((shape, index) => (
          <div>
            <GetShapes key={index} shape={shape} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shape3D;
