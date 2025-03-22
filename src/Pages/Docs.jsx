import { Canvas } from "@react-three/fiber";
import React from "react";
import { useState } from "react";
import { ParticleSystem } from "./../components/ui-3d/particle-system";
import { OrbitControls, Text, GradientTexture, Html } from "@react-three/drei";

const Docs = () => {
  const position = [0, 0, 0];
  const rotation = [0, 0, 0];
  const scale = [1, 1, 1];
  const width = 7;
  const height = 8;
  const depth = 0.1;
  const textColor = "#FFFFFF";
  const title = "Installation Guide";

  const installationSteps = [
    `npm install three @react-three/fiber @react-three/drei`,
    `npm install three @react-three/fiber @react-three/drei\nUse dynamic imports with SSR disabled for Three.js components`,
    `npm install three\nOr use CDN:\n<script src='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js'></script>`,
  ];

  const [activeTab, setActiveTab] = useState("react");

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={["#000"]} />

        <group position={position} rotation={rotation} scale={scale}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <ambientLight intensity={2} />
            <meshStandardMaterial>
              <GradientTexture
                attach="map"
                stops={[0, 1]}
                colors={["#222222", "#444444"]}
              />
            </meshStandardMaterial>
          </mesh>

          <Html>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-4 p-2 bg-white rounded-lg shadow-md">
              {Object.keys(installationSteps).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold rounded ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </Html>

          <Text
            position={[0, height / 2.5, depth / 2 + 0.01]}
            fontSize={0.4}
            color={textColor}
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>

          {installationSteps.map((step, index) => (
            <Text
              key={index}
              position={[0, height / 4 - index * 0.5, depth / 2 + 0.01]}
              fontSize={0.2}
              color={textColor}
              anchorX="center"
              anchorY="middle"
              maxWidth={width * 0.9}
              textAlign="center"
            >
              {step}
            </Text>
          ))}
        </group>

        <OrbitControls />

        <ParticleSystem
          count={1000}
          color={"#FFFFFF"}
          size={0.15}
          speed={0.0005}
        />
      </Canvas>
    </div>
  );
};

export default Docs;
