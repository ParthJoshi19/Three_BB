"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars, Edges } from "@react-three/drei";
import GUI from "lil-gui";
// import * as THREE from "three";
// 3D Model Component
function Model({ settings }) {
  const { scene } = useGLTF("./airbus.glb");
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
          child.material.metalness = settings.metalness;
          child.material.roughness = settings.roughness;
          child.material.emissiveIntensity = settings.emissiveIntensity;
          child.material.castShadow = true;
          child.material.receiveShadow = true;
        }
      });
    }
  }, [settings]);
  // return (
  //   <mesh ref={modelRef}>
  //     <boxGeometry />
  //     <meshStandardMaterial color={settings.modelColor} />
  //   </mesh>
  // );
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
    metalness: 0.5,
    roughness: 0.5,
    emissiveColor: "#000000",
    emissiveIntensity: 0.5,
    cameraFOV: 50,
  });

  const gui = useRef(null);

  useEffect(() => {
    if (!gui.current) {
      gui.current = new GUI();
      gui.current.add(settings, "modelScale", 0.1, 5).onChange((val) => {
        setSettings((prev) => ({ ...prev, modelScale: val }));
      });
      gui.current.addColor(settings, "modelColor").onChange((val) => {
        setSettings((prev) => ({ ...prev, modelColor: val }));
      });
      gui.current.add(settings, "metalness", 0, 1).onChange((val) => {
        setSettings((prev) => ({ ...prev, metalness: val }));
      });
      gui.current.add(settings, "roughness", 0, 1).onChange((val) => {
        setSettings((prev) => ({ ...prev, roughness: val }));
      });
      gui.current.addColor(settings, "emissiveColor").onChange((val) => {
        setSettings((prev) => ({ ...prev, emissiveColor: val }));
      });
      gui.current.add(settings, "emissiveIntensity", 0, 5).onChange((val) => {
        setSettings((prev) => ({ ...prev, emissiveIntensity: val }));
      });
      gui.current.add(settings, "positionX", -10, 10).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionX: val }));
      });
      gui.current.add(settings, "positionY", -10, 10).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionY: val }));
      });
      gui.current.add(settings, "positionZ", -10, 10).onChange((val) => {
        setSettings((prev) => ({ ...prev, positionZ: val }));
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
      gui.current.add(settings, "cameraFOV", 30, 120).onChange((val) => {
        setSettings((prev) => ({ ...prev, cameraFOV: val }));
      });
    }

    return () => {
      gui.current?.destroy();
      gui.current = null;
    };
  }, []);

  // Function to log the scene settings
  const logCode = () => {
    console.log(`
      Scene Settings:
      -----------------------------
      import React, { useRef, useState, useEffect } from "react";
      import { Canvas, useThree } from "@react-three/fiber";
      import { useGLTF, OrbitControls } from "@react-three/drei";

      function Model() {
        const modelRef = useRef();

        useEffect(() => {
          if (modelRef.current) {
            modelRef.current.scale.set(${settings.modelScale}, ${settings.modelScale}, ${settings.modelScale});
            modelRef.current.rotation.set(${settings.rotationX}, ${settings.rotationY}, ${settings.rotationZ});
            modelRef.current.position.set(${settings.positionX}, ${settings.positionY}, ${settings.positionZ});
            modelRef.current.traverse((child) => {
              if (child.isMesh) {
                child.material.color.set('${settings.modelColor}');
              }
            });
          }
        }, []);

        return <mesh ref={modelRef}>
    <boxGeometry/>
  </mesh>
      }

      function CameraController({ fov }) {
        const { camera } = useThree();

        useEffect(() => {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }, [fov]);

        return null;
      }

      function Scene() {
        return (
          <div  style={{position:"absolute",height:"100vh",width:"100vw",inset:"0"}}>
            <Canvas camera={{ fov: ${settings.cameraFOV}, position: [0, 0, 10] }}>
              <CameraController fov={${settings.cameraFOV}} />
              <ambientLight intensity={2} />
              <pointLight position={[10, 10, 10]} />
              <Model  />
              <OrbitControls />
            </Canvas>
          </div>
        );
      }

      export default Scene;
    `);
  };

  return (
    <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        background: "#000",
        inset: "0",
      }}
    >
      <Canvas camera={{ fov: settings.cameraFOV, position: [0, 0, 10] }}>
        <CameraController fov={settings.cameraFOV} />
        <directionalLight
          position={[10, 10, 25]}
          intensity={2}
          color="white"
          castShadow
        />
        <directionalLight
          position={[-10, -10, 25]}
          intensity={2}
          color="white"
          castShadow
        />
        <ambientLight intensity={0.5} />

        <Stars/>
      
        <Model settings={settings} />
        <OrbitControls />
      </Canvas>

      <button
        onClick={logCode}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Log Code
      </button>
    </div>
  );
}

export default Scene;

// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { useGLTF, OrbitControls, Stars } from "@react-three/drei";
// import GUI from "lil-gui";

// // 3D Model Component
// function Model({ settings }) {
//   const { scene } = useGLTF("./shiba.glb");
//   const modelRef = useRef();

//   useEffect(() => {
//     if (modelRef.current) {
//       modelRef.current.scale.set(
//         settings.modelScale,
//         settings.modelScale,
//         settings.modelScale
//       );
//       modelRef.current.rotation.set(
//         settings.rotationX,
//         settings.rotationY,
//         settings.rotationZ
//       );
//       modelRef.current.position.set(
//         settings.positionX,
//         settings.positionY,
//         settings.positionZ
//       );
//       // modelRef.current.color.shaderMaterial
//       modelRef.current.traverse((child) => {
//         if (child.isMesh) {
//           child.material.color.set(settings.modelColor);
//         }
//       });
//     }
//   }, [settings]);

//   return (
//     <mesh ref={modelRef}>
//       <boxGeometry />
//     </mesh>
//   );
// }

// // Camera Controller
// function CameraController({ fov }) {
//   const { camera } = useThree();

//   useEffect(() => {
//     camera.fov = fov;
//     camera.updateProjectionMatrix();
//   }, [fov]);

//   return null;
// }

// // Main Scene Component
// function Scene() {
//   const [settings, setSettings] = useState({
//     modelScale: 1,
//     rotationX: 0,
//     rotationY: 0,
//     rotationZ: 0,
//     positionX: 0,
//     positionY: 0,
//     positionZ: 0,
//     modelColor: "#ffffff",
//     cameraFOV: 50,
//   });

//   const gui = useRef(null);

//   useEffect(() => {
//     if (!gui.current) {
//       gui.current = new GUI();

//       gui.current.add(settings, "modelScale", 0.1, 5).onChange((val) => {
//         setSettings((prev) => ({ ...prev, modelScale: val }));
//       });

//       gui.current.addColor(settings, "modelColor").onChange((val) => {
//         setSettings((prev) => ({ ...prev, modelColor: val }));
//       });

//       // gui.current.add(settings,"metalness",0,1).onChange((val)=>{
//       //   setSettings((prev)=>({...prev,metalness:val}))
//       // })

//       gui.current.add(settings, "rotationX", 0, Math.PI * 2).onChange((val) => {
//         setSettings((prev) => ({ ...prev, rotationX: val }));
//       });
//       gui.current.add(settings, "rotationY", 0, Math.PI * 2).onChange((val) => {
//         setSettings((prev) => ({ ...prev, rotationY: val }));
//       });
//       gui.current.add(settings, "rotationZ", 0, Math.PI * 2).onChange((val) => {
//         setSettings((prev) => ({ ...prev, rotationZ: val }));
//       });

//       gui.current.add(settings, "positionX", -10, 10).onChange((val) => {
//         setSettings((prev) => ({ ...prev, positionX: val }));
//       });
//       gui.current.add(settings, "positionY", -10, 10).onChange((val) => {
//         setSettings((prev) => ({ ...prev, positionY: val }));
//       });
//       gui.current.add(settings, "positionZ", -10, 10).onChange((val) => {
//         setSettings((prev) => ({ ...prev, positionZ: val }));
//       });

//       gui.current.add(settings, "cameraFOV", 30, 120).onChange((val) => {
//         setSettings((prev) => ({ ...prev, cameraFOV: val }));
//       });
//     }

//     return () => {
//       gui.current?.destroy();
//       gui.current = null;
//     };
//   }, []);

//   // Function to log the scene settings
//   const logCode = () => {
//     console.log(`
//       Scene Settings:
//       -----------------------------
//       import React, { useRef, useState, useEffect } from "react";
//       import { Canvas, useThree } from "@react-three/fiber";
//       import { useGLTF, OrbitControls } from "@react-three/drei";

//       function Model() {
//         const { scene } = useGLTF("./shiba.glb");
//         const modelRef = useRef();

//         useEffect(() => {
//           if (modelRef.current) {
//             modelRef.current.scale.set(${settings.modelScale}, ${settings.modelScale}, ${settings.modelScale});
//             modelRef.current.rotation.set(${settings.rotationX}, ${settings.rotationY}, ${settings.rotationZ});
//             modelRef.current.position.set(${settings.positionX}, ${settings.positionY}, ${settings.positionZ});
//             modelRef.current.traverse((child) => {
//               if (child.isMesh) {
//                 child.material.color.set('${settings.modelColor}');
//               }
//             });
//           }
//         }, []);

//         return <mesh ref={modelRef}>
//     <boxGeometry/>
//   </mesh>
//       }

//       function CameraController({ fov }) {
//         const { camera } = useThree();

//         useEffect(() => {
//           camera.fov = fov;
//           camera.updateProjectionMatrix();
//         }, [fov]);

//         return null;
//       }

//       function Scene() {
//         return (
//           <div  style={{position:"absolute",height:"100vh",width:"100vw",inset:"0"}}>
//             <Canvas camera={{ fov: ${settings.cameraFOV}, position: [0, 0, 10] }}>
//               <CameraController fov={${settings.cameraFOV}} />
//               <ambientLight intensity={2} />
//               <pointLight position={[10, 10, 10]} />
//               <Model  />
//               <OrbitControls />
//             </Canvas>
//           </div>
//         );
//       }

//       export default Scene;
//     `);
//   };

//   return (
//     <div
//       style={{
//         position: "absolute",
//         height: "100vh",
//         width: "100vw",
//         background: "#000",
//         inset: "0",
//       }}
//     >
//       <Canvas camera={{ fov: settings.cameraFOV, position: [0, 0, 10] }}>
//         <CameraController fov={settings.cameraFOV} />
//         <ambientLight intensity={2} />
//         <Stars />
//         <mesh>
//           <Model settings={settings} />
//         <shaderMaterial shadowSide={2}/>
//         </mesh>

//         <OrbitControls />
//       </Canvas>

//       <button
//         onClick={logCode}
//         style={{
//           position: "absolute",
//           top: "10px",
//           left: "10px",
//           padding: "10px",
//           background: "#007bff",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Log Code
//       </button>
//     </div>
//   );
// }

// export default Scene;
