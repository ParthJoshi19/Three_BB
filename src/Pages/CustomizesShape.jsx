"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars, Edges, Html } from "@react-three/drei";
import GUI from "lil-gui";
import { useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as THREE from "three";
const GetModel = (shape) => {
  let geometry;
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
      geometry = <dodecahedronGeometry />;
      break;
    case "icosahedron":
      geometry = <icosahedronGeometry />;
      break;
    case "octahedron":
      geometry = <octahedronGeometry />;
      break;
    case "tetrahedron":
      geometry = <tetrahedronGeometry />;
      break;
    case "ring":
      geometry = <ringGeometry args={[1, 2, 32]} />;
      break;
    case "capsule":
      geometry = <capsuleGeometry args={[1, 2, 8, 16]} />;
      break;
    default:
      const {scene}=useGLTF(shape.shape)
      geometry = <primitive object={scene} />;
      break;
  }
  return geometry;
};

const GetModelUser = (shape) => {
  let geometry;
  switch (shape.toLowerCase()) {
    case "box":
      geometry = "<boxGeometry  />";
      break;
    case "sphere":
      geometry = "<sphereGeometry />";
      break;
    case "plane":
      geometry = "<planeGeometry />";
      break;
    case "circle":
      geometry = " <circleGeometry />";
      break;
    case "cone":
      geometry = "<coneGeometry  />";
      break;
    case "cylinder":
      geometry = "<cylinderGeometry />";
      break;
    case "torus":
      geometry = "<torusGeometry  />";
      break;
    case "torus-knot":
      geometry = "<torusKnotGeometry  />";
      break;
    case "dodecahedron":
      geometry = "<dodecahedronGeometry  />";
      break;
    case "icosahedron":
      geometry = "<icosahedronGeometry  />";
      break;
    case "octahedron":
      geometry = " <octahedronGeometry  />";
      break;
    case "tetrahedron":
      geometry = "<tetrahedronGeometry  />";
      break;
    case "ring":
      geometry = "<ringGeometry />";
      break;
    case "capsule":
      geometry = "<capsuleGeometry  />";
      break;
    default:
      geometry = "<boxGeometry  />";
  }
  return geometry.toString();
};


const GetModelUser2 = ( shape ) => {
  // console.log(shape)
  let geometry;
  switch (shape.toLowerCase()) {
    case "box":
      geometry = "BoxGeometry(1, 2, 32)";
      break;
    case "sphere":
      geometry = "SphereGeometry(1.5, 32, 32)";
      break;
    case "plane":
      geometry = "PlaneGeometry(4, 4)";
      break;
    case "circle":
      geometry = "CircleGeometry(2, 32)";
      break;
    case "cone":
      geometry = "ConeGeometry(1.5, 3, 32)";
      break;
    case "cylinder":
      geometry = "CylinderGeometry(1, 1, 3, 32)";
      break;
    case "torus":
      geometry = "TorusGeometry(1, 0.4, 16, 100)";
      break;
    case "torus-knot":
      geometry = "TorusKnotGeometry(1, 0.3, 100, 16)";
      break;
    case "dodecahedron":
      geometry = "DodecahedronGeometry(1.5)";
      break;
    case "icosahedron":
      geometry = "IcosahedronGeometry(1.5)";
      break;
    case "octahedron":
      geometry = "OctahedronGeometry(1.5)";
      break;
    case "tetrahedron":
      geometry = "TetrahedronGeometry(1.5)";
      break;
    case "ring":
      geometry = "RingGeometry(1, 2, 32)";
      break;
    case "capsule":
      geometry = "CapsuleGeometry(1, 2, 8, 16)";
      break;
    default:
      geometry = "BoxGeometry(1, 2, 32)";
  }

  return geometry;
};

function Model({ settings, shape }) {
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
          if(child.material.emissive)
          child.material.emissive.set(settings.emissiveColor);
        }
      });
    }
  }, [settings]);
  return (
    <mesh ref={modelRef}>
      <GetModel shape={shape} />
      <meshStandardMaterial color={settings.modelColor} side={THREE.DoubleSide} />
    </mesh>
  );
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
  const location = useLocation();

  const [active, setActive] = useState("React");
  const { shape } = location.state;
  
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    modelScale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    modelColor: "#4169E1",
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

  const logCode = () => {
    setOpen(!open);
  };
  const codesSnips = {
    React: `
  import React, { useRef, useState, useEffect } from "react";
  import { Canvas, useThree } from "@react-three/fiber";
  import { useGLTF, OrbitControls } from "@react-three/drei";
  
  function Model() {
  const modelRef = useRef();
  
  useEffect(() => {
  if (modelRef.current) {
    modelRef.current.scale.set(${settings.modelScale}, ${
      settings.modelScale
    }, ${settings.modelScale});
    modelRef.current.rotation.set(${settings.rotationX}, ${
      settings.rotationY
    }, ${settings.rotationZ});
    modelRef.current.position.set(${settings.positionX}, ${
      settings.positionY
    }, ${settings.positionZ});
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set('${settings.modelColor}');
        child.material.emissive.set('${settings.emissiveColor}');
        child.material.emissiveIntensity = ${settings.emissiveIntensity};
        child.material.castShadow = true;
      }
      });
    
  }
  }, []);
  
  return (<mesh ref={modelRef}>
          ${GetModelUser(shape)}
          <meshStandardMaterial color={"${settings.modelColor}"}  />
        </mesh>);
  }
  
  function CameraController({ fov }) {
  const { camera } = useThree();
  
  useEffect(() => {
  camera.fov = fov;
  camera.updateProjectionMatrix();
  }, [fov]);
  
  return null;
  }
  
  const Scene=()=> {
  return (
  <div  style={{position:"absolute",height:"100vh",width:"100vw",inset:"0"}}>
    <Canvas camera={{ fov: ${settings.cameraFOV}, position: [0, 0, 10] }}>
      <CameraController fov={${settings.cameraFOV}} />
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
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <Model  />
      <OrbitControls />
    </Canvas>
  </div>
  );
  }
  
  export default Scene;
  `,
    Next: `
    "use client";
  import React, { useRef, useState, useEffect } from "react";
  import { Canvas, useThree } from "@react-three/fiber";
  import { useGLTF, OrbitControls } from "@react-three/drei";
  
  function Model() {
  const modelRef = useRef();
  
  useEffect(() => {
  if (modelRef.current) {
    modelRef.current.scale.set(${settings.modelScale}, ${
      settings.modelScale
    }, ${settings.modelScale});
    modelRef.current.rotation.set(${settings.rotationX}, ${
      settings.rotationY
    }, ${settings.rotationZ});
    modelRef.current.position.set(${settings.positionX}, ${
      settings.positionY
    }, ${settings.positionZ});
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.set('${settings.modelColor}');
        child.material.emissive.set('${settings.emissiveColor}');
        child.material.emissiveIntensity = ${settings.emissiveIntensity};
        child.material.castShadow = true;
      }
      });
    
  }
  }, []);
  
  return (<mesh ref={modelRef}>
          ${GetModelUser(shape)}
          <meshStandardMaterial color={"${settings.modelColor}"}  />
        </mesh>);
  }
  
  function CameraController({ fov }) {
  const { camera } = useThree();
  
  useEffect(() => {
  camera.fov = fov;
  camera.updateProjectionMatrix();
  }, [fov]);
  
  return null;
  }
  
  const Page=()=> {
  return (
  <div  style={{position:"absolute",height:"100vh",width:"100vw",inset:"0"}}>
    <Canvas camera={{ fov: ${settings.cameraFOV}, position: [0, 0, 10] }}>
      <CameraController fov={${settings.cameraFOV}} />
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
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <Model  />
      <OrbitControls />
    </Canvas>
  </div>
  );
  }
  
  export default Page;`,
    Vanilla: `
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(${settings.cameraFOV}, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0,0,10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(10, 10, 25);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(-10, -10, 25);
scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const geometry = new THREE.${GetModelUser2(shape)};
const material = new THREE.MeshStandardMaterial({ color: "${settings.modelColor}", metalness: ${settings.metalness}, roughness: ${settings.roughness}, emissive: "${settings.emissiveColor}", emissiveIntensity: ${settings.emissiveIntensity} });
const shape = new THREE.Mesh(geometry, material);
shape.rotation.set(${settings.rotationX}, ${settings.rotationY}, ${settings.rotationZ});
shape.position.set(${settings.positionX}, ${settings.positionY}, ${settings.positionZ});
shape.scale.set(${settings.modelScale}, ${settings.modelScale}, ${settings.modelScale});
shape.castShadow = true;
scene.add(shape);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;

function animate() {
  requestAnimationFrame(animate);
  controls.update(); 
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
`,
  };

  const [copied, setCopied] = useState(false);
  const copyToClipboard = (line) => {
    navigator.clipboard.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <Stars />

        <Model settings={settings} shape={shape} />
        <OrbitControls />
      </Canvas>

      {
        <div
          className={`w-[60%] group overflow-scroll overflow-x-hidden h-[80%] transition-all duration-300 left-[20%] top-[10%] rounded-lg absolute bg-[rgba(255,255,255,0.09)] border-2 border-white ${
            !open ? "scale-0" : "scale-105"
          }`}
        >
          <div className="ml-10 mt-10 flex gap-20 w-full h-fit">
            {["React", "Next", "Vanilla"].map((tab) => (
              <div
                key={tab}
                className="border-2 px-3 py-1 border-blue-600 bg-[rgba(83,97,255,0.5)] rounded-xl text-white cursor-pointer"
                onClick={() => setActive(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="overflow-auto relative h-fit bg-[rgba(255,255,255,80%)] m-4 rounded-lg border-2 border-white">
            {copied && <div className="absolute w-fit left-2 rounded-xl bg-[rgba(83,97,255,0.5)] border-2 border-blue-600 p-1 text-xs"> copied</div>}
            <div onClick={() => copyToClipboard(codesSnips[active])} className="absolute right-3 text-white bg-[rgba(255,255,255,0.5)] px-2 py-1 border-2 border-white rounded-xl cursor-pointer"><i className="ri-clipboard-line"></i></div>
            <pre>
              <SyntaxHighlighter style={tomorrowNight}>{codesSnips[active]}</SyntaxHighlighter>
            </pre>
          </div>
        </div>
      }

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
        Get Code
      </button>
    </div>
  );
}

export default Scene;