"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import GUI from "lil-gui";

// 3D Model Component
function Model({ settings, modelUrl }) {
  const { scene } = useGLTF(modelUrl || "./airbus.glb"); // Use uploaded model if available
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(
        settings.modelScale,
        settings.modelScale,
        settings.modelScale
      );
      modelRef.current.rotation.set(
        settings.rotationX,
        settings.rotationY,
        settings.rotationZ
      );
      modelRef.current.position.set(
        settings.positionX,
        settings.positionY,
        settings.positionZ
      );
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(settings.modelColor);
        }
      });
    }
  }, [settings, modelUrl]);

  return <primitive ref={modelRef} object={scene} />;
}

// Camera Controller
function CameraController({ fov }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [fov]);

  return null;
}

// Main Scene Component
function Scene() {
  const [settings, setSettings] = useState({
    modelScale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    modelColor: "#ffffff",
    cameraFOV: 50,
  });

  const [modelUrl, setModelUrl] = useState(null); // State to store uploaded model URL
  const gui = useRef(null);

  useEffect(() => {
    if (!gui.current) {
      gui.current = new GUI();

      gui.current.add(settings, "modelScale", 0.1, 5).onChange((val) => {
        setSettings((prev) => ({ ...prev, modelScale: val }));
      });

      gui.current.add(settings, "rotationX", 0, Math.PI * 2).onChange((val) => {
        setSettings((prev) => ({ ...prev, rotationX: val }));
      });
      gui.current.add(settings, "rotationY", 0, Math.PI * 2).onChange((val) => {
        setSettings((prev) => ({ ...prev, rotationY: val }));
      });
      gui.current.add(settings, "rotationZ", 0, Math.PI * 2).onChange((val) => {
        setSettings((prev) => ({ ...prev, rotationZ: val }));
      });

      gui.current.add(settings, "positionX", -100, 100).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionX: val }));
      });
      gui.current.add(settings, "positionY", -100, 100).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionY: val }));
      });
      gui.current.add(settings, "positionZ", -100, 100).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionZ: val }));
      });

      gui.current.addColor(settings, "modelColor").onChange((val) => {
        setSettings((prev) => ({ ...prev, modelColor: val }));
      });

      gui.current.add(settings, "cameraFOV", 30, 120).onChange((val) => {
        setSettings((prev) => ({ ...prev, cameraFOV: val }));
      });
    }

    return () => {
      gui.current?.destroy();
      gui.current = null;
    };
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      console.log(url)
      setModelUrl(url); // Set uploaded model URL
    }
  };

  return (
    <div className="w-screen h-screen absolute inset-0">
      <Canvas camera={{ fov: settings.cameraFOV, position: [0, 0, 10] }}>
        <CameraController fov={settings.cameraFOV} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />
        <Model settings={settings} modelUrl={modelUrl} />
        <OrbitControls />
      </Canvas>

      {/* File Input for Uploading Model */}
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileUpload}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "5px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      />

      <button
        onClick={() => setModelUrl(null)} // Reset to default model
        style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          padding: "10px",
          background: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Reset Model
      </button>
    </div>
  );
}

export default Scene;
