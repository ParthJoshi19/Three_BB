import React, { useEffect, useCallback, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

const UploadModel = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
      event.target.value = null;
    }
  };

  const processFile = (file) => {
    const validExtensions = [".glb", ".gltf"];
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (validExtensions.includes(extension)) {
      const url = URL.createObjectURL(file);
      console.log("Processing file:", file);
      navigate("/customizemodel", { state: { shape: url } });
    } else {
      alert("Please upload a valid .glb or .gltf file");
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    console.log("Full drop event:", event);
    console.log("DataTransfer types:", event.dataTransfer.types);
    console.log("DataTransfer items:", event.dataTransfer.items);
    console.log("DataTransfer files:", event.dataTransfer.files);

    let foundFile = null;

    // ✅ First, check `dataTransfer.files`
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      foundFile = event.dataTransfer.files[0];
    }

    // ✅ If `files` is empty, check `dataTransfer.items`
    if (!foundFile && event.dataTransfer.items) {
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        const item = event.dataTransfer.items[i];

        // Some browsers require `webkitGetAsEntry()`
        if (item.kind === "file") {
          foundFile = item.getAsFile();
          break;
        }
      }
    }

    if (foundFile) {
      console.log("Successfully retrieved file:", foundFile);
      processFile(foundFile);
    } else {
      console.error("No file could be extracted from drop event");
      alert("Could not retrieve file. Make sure you are dragging from your file system.");
    }
  }, [navigate]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy"; // ✅ Ensures proper file drop behavior
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    dropZone.addEventListener("dragenter", handleDragEnter);
    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("drop", handleDrop);
    dropZone.addEventListener("dragleave", handleDragLeave);

    return () => {
      dropZone.removeEventListener("dragenter", handleDragEnter);
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("drop", handleDrop);
      dropZone.removeEventListener("dragleave", handleDragLeave);
    };
  }, [handleDragEnter, handleDragOver, handleDrop, handleDragLeave]);

  return (
    <div
      ref={dropZoneRef}
      className={`w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black ${
        isDragging ? "border-4 border-blue-500" : ""
      }`}
    >
      <Canvas camera={{ fov: window.innerWidth < 768 ? 130 : 75 }} className="border-2">
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />
        <Float speed={6} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[0, 0, 0]} scale={[1, 1, 0.2]} onClick={() => document.getElementById("file-upload").click()}>
            <boxGeometry args={[2.3, 1.2, 1]} />
            <meshStandardMaterial color={isDragging ? "hotpink" : "royalblue"} />
            <Text position={[0, 2, 0.51]} fontSize={0.75} color="#00FF00" anchorX="center" anchorY="middle">
              Customize Your 3D Model
            </Text>
            <Text position={[0, 0, 0.51]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
              {isDragging ? "Drop your file here" : "Upload 3D Model"}
            </Text>
            <Text position={[0, -1.5, 0.51]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
              Upload your 3D model in .glb or .gltf format
            </Text>
            <Text position={[0, -2, 0.51]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
              Happy Coding!!!
            </Text>
          </mesh>
        </Float>
      </Canvas>

      <input id="file-upload" type="file" accept=".glb,.gltf" onChange={handleFileUpload} className="hidden" />
    </div>
  );
};

export default UploadModel;
