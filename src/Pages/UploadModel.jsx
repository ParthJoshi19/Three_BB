
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
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
      <Canvas >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />
        <mesh
          position={[0, 0, 0]}
          scale={[1, 1, 0.2]}
          onClick={() => document.getElementById("file-upload").click()}
        >
          <boxGeometry args={[2.3, 1.2, 1]}  />
          <meshStandardMaterial color="royalblue" />
          <directionalLight
            position={[10, 10, 25]}
            intensity={1}
            color="white"
            castShadow
          />
          <ambientLight intensity={0.2} />
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
        </mesh>
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