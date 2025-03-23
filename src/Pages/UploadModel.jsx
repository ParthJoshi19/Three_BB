import React from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

const UploadModel = () => {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      navigate("/customizemodel", { state: { shape: url } });

      event.target.value = null;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <Canvas className="border-2">
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />
        <Float speed={6} rotationIntensity={1} floatIntensity={2}>
          <mesh
            position={[0, 0, 0]}
            scale={[1, 1, 0.2]}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <boxGeometry args={[2.3, 1.2, 1]} />
            <meshStandardMaterial color="royalblue" />
            <directionalLight
              position={[10, 10, 25]}
              intensity={1}
              color="white"
              castShadow
            />
            <ambientLight intensity={0.2} />
            <Text
              position={[0, 2, 0.51]}
              fontSize={0.75}
              color="#00FF00"
              anchorX="center"
              anchorY="middle"
              depthWrite={false}
            >
              Customize Your 3D Model
            </Text>
            <Text
              position={[0, 0, 0.51]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              depthWrite={false}
            >
              Upload 3D Model
            </Text>
            <Text
              position={[0, -1.5, 0.51]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              depthWrite={false}
            >
              Upload your 3D model in .glb or .gltf format only
            </Text>
            <Text
              position={[0, -2, 0.51]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              depthWrite={false}
            >
              Happy Coding!!!
            </Text>
          </mesh>
        </Float>
      </Canvas>

      <input
        id="file-upload"
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default UploadModel;