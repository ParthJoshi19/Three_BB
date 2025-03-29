"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars, Edges, Html } from "@react-three/drei";
import GUI from "lil-gui";
import { useLocation } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as THREE from "three";
import gsap from "gsap";

function Model({ settings, setSettings, shape }) {
  const modelRef = useRef();
  const { scene } = useGLTF(shape);
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
          if (child.material.emissive)
            child.material.emissive.set(settings.emissiveColor);
        }
      });
    }
  }, [settings]);
  const [animate, setAnimate] = useState(null);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, animation: animate }));
    if (animate === 1) {
      gsap.to(modelRef.current.position, {
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
      gsap.to(modelRef.current.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "linear",
      });
    }

    if (animate === 2) {
      gsap.to(modelRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
      gsap.to(modelRef.current.position, {
        x: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
    }

    if (animate === 3) {
      gsap.to(modelRef.current.position, {
        x: "+=1",
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
      gsap.to(modelRef.current.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 5,
        repeat: -1,
        ease: "linear",
      });
    }

    if (animate === 4) {
      gsap.to(modelRef.current.material.color, {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut",
      });
    }

    if (animate === 5) {
      gsap.to(modelRef.current.position, {
        x: "+=0.1",
        y: "-=0.1",
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        ease: "power1.inOut",
      });
    } else {
      gsap.killTweensOf(modelRef.current);
    }
  }, [animate]);

  const gui = useRef(null);
  useEffect(() => {
    if (!gui.current) {
      gui.current = new GUI();
      const animationFolder = gui.current.addFolder("GSAP Animations");

      animationFolder
        .add(settings, "animation1")
        .name("Floating & Rotation")
        .onChange((val) => {
          1 === animate ? setAnimate(null) : setAnimate(1);
        });

      animationFolder
        .add(settings, "animation2")
        .name("Scale Pulse & Side Movement")
        .onChange((val) => {
          2 === animate ? setAnimate(null) : setAnimate(2);
        });

      animationFolder
        .add(settings, "animation3")
        .name("Orbit Rotation")
        .onChange((val) => {
          3 === animate ? setAnimate(null) : setAnimate(3);
        });

      animationFolder
        .add(settings, "animation4")
        .name("Color Pulse")
        .onChange((val) => {
          4 === animate ? setAnimate(null) : setAnimate(4);
        });

      animationFolder
        .add(settings, "animation5")
        .name("Jittery Shake")
        .onChange((val) => {
          5 === animate ? setAnimate(null) : setAnimate(5);
        });
      animationFolder.close();
    }

    return () => {
      gui.current?.destroy();
      gui.current = null;
    };
  }, []);
  return (
    <mesh ref={modelRef}>
      <primitive object={scene} />
      <meshStandardMaterial
        color={settings.modelColor}
        side={THREE.DoubleSide}
      />
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
    modelColor: "#ffffff",
    metalness: 0.5,
    roughness: 0.5,
    emissiveColor: "#000000",
    emissiveIntensity: 1,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    cameraFOV: 75,
    animation: null,
    animation1: false,
    animation2: false,
    animation3: false,
    animation4: false,
    animation5: false,
  });

  const gui = useRef(null);

  useEffect(() => {
    if (!gui.current) {
      gui.current = new GUI();
      const modelFolder = gui.current.addFolder("Model Properties");
      modelFolder
        .add(settings, "modelScale", 0.1, 5)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, modelScale: val }))
        );
      modelFolder
        .addColor(settings, "modelColor")
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, modelColor: val }))
        );
      modelFolder
        .add(settings, "metalness", 0, 1)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, metalness: val }))
        );
      modelFolder
        .add(settings, "roughness", 0, 1)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, roughness: val }))
        );
      modelFolder
        .addColor(settings, "emissiveColor")
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, emissiveColor: val }))
        );
      modelFolder
        .add(settings, "emissiveIntensity", 0, 5)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, emissiveIntensity: val }))
        );

      const positionFolder = gui.current.addFolder("Position & Rotation");
      positionFolder
        .add(settings, "positionX", -10, 10)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, positionX: val }))
        );
      positionFolder
        .add(settings, "positionY", -10, 10)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, positionY: val }))
        );
      positionFolder
        .add(settings, "positionZ", -10, 10)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, positionZ: val }))
        );
      positionFolder
        .add(settings, "rotationX", 0, Math.PI * 2)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, rotationX: val }))
        );
      positionFolder
        .add(settings, "rotationY", 0, Math.PI * 2)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, rotationY: val }))
        );
      positionFolder
        .add(settings, "rotationZ", 0, Math.PI * 2)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, rotationZ: val }))
        );

      // Camera Settings Folder
      const cameraFolder = gui.current.addFolder("Camera Settings");
      cameraFolder
        .add(settings, "cameraFOV", 30, 120)
        .onChange((val) =>
          setSettings((prev) => ({ ...prev, cameraFOV: val }))
        );

      modelFolder.open();
      positionFolder.open();
      cameraFolder.open();
    }

    return () => {
      gui.current?.destroy();
      gui.current = null;
    };
  }, []);
  const gsapAnimations = [
    {
      1: `gsap.to(modelRef.current.position, {
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
      gsap.to(modelRef.current.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "linear",
      });`,
    },
    {
      2: `
      gsap.to(modelRef.current.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
      gsap.to(modelRef.current.position, {
        x: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
      `,
    },
    {
      3: `gsap.to(modelRef.current.position, {
        x: "+=1",
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
      gsap.to(modelRef.current.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 5,
        repeat: -1,
        ease: "linear",
      });`,
    },
    {
      4: `gsap.to(modelRef.current.material.color, {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut",
      });`,
    },
    {
      5: `gsap.to(modelRef.current.position, {
        x: "+=0.1",
        y: "-=0.1",
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        ease: "power1.inOut",
      });`,
    },
  ];
  const gsapAnimationsV = [
    {
      1: `gsap.to(shape.position, {
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
      gsap.to(shape.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "linear",
      });`,
    },
    {
      2: `
      gsap.to(shape.scale, {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
      gsap.to(shape.position, {
        x: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });
      `,
    },
    {
      3: `gsap.to(shape.position, {
        x: "+=1",
        y: "+=0.5",
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });
      gsap.to(shape.rotation, {
        y: "+=" + Math.PI * 2,
        duration: 5,
        repeat: -1,
        ease: "linear",
      });`,
    },
    {
      4: `gsap.to(shape.material.color, {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power1.inOut",
      });`,
    },
    {
      5: `gsap.to(shape.position, {
        x: "+=0.1",
        y: "-=0.1",
        repeat: -1,
        yoyo: true,
        duration: 0.1,
        ease: "power1.inOut",
      });`,
    },
  ];

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
  const {scene}=useGLTF("${shape}"); // Replace with model path gltf or glb
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
        if(child.material.emissive)
          child.material.emissive.set('${settings.emissiveColor}');
        child.material.emissiveIntensity = ${settings.emissiveIntensity};
        child.material.castShadow = true;
      }
      });
      ${
        settings.animation
          ? gsapAnimations[settings.animation - 1][settings.animation]
          : ""
      }
  }
  }, []);
  
  return (<mesh ref={modelRef}>
          <primitive object={scene} />
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
  import gsap from "gsap";
  
  function Model() {
  const modelRef = useRef();
  const {scene}=useGLTF("${shape}"); // Replace with model path gltf or glb
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
        if(child.material.emissive)
          child.material.emissive.set('${settings.emissiveColor}');
        child.material.emissiveIntensity = ${settings.emissiveIntensity};
        child.material.castShadow = true;
      }
      });
      ${
        settings.animation
          ? gsapAnimations[settings.animation - 1][settings.animation]
          : ""
      }
  }
  }, []);
  
  return (<mesh ref={modelRef}>
          <primitive object={scene} />
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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import gsap from "gsap";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(${
      settings.cameraFOV
    }, window.innerWidth / window.innerHeight, 0.1, 100);
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

const loader = new GLTFLoader();
loader.load("${shape}", (gltf) => {
  const model = gltf.scene;
  model.position.set(${settings.positionX}, ${settings.positionY}, ${
      settings.positionZ
    }); 
  model.rotation.set(${settings.rotationX}, ${settings.rotationY}, ${
      settings.rotationZ
    }); 
  model.scale.set(${settings.modelScale}, ${settings.modelScale}, ${
      settings.modelScale
    }); 
  model.castsShadow = true;
  
  scene.add(model);
  ${
    settings.animation
      ? gsapAnimationsV[settings.animation - 1][settings.animation]
      : ""
  }
});

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

        <Model settings={settings} setSettings={setSettings} shape={shape} />
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
            {copied && (
              <div className="absolute w-fit left-2 rounded-xl bg-[rgba(83,97,255,0.5)] border-2 border-blue-600 p-1 text-xs">
                {" "}
                copied
              </div>
            )}
            <div
              onClick={() => copyToClipboard(codesSnips[active])}
              className="absolute right-3 text-white bg-[rgba(255,255,255,0.5)] px-2 py-1 border-2 border-white rounded-xl cursor-pointer"
            >
              <i className="ri-clipboard-line"></i>
            </div>
            <pre>
              <SyntaxHighlighter style={tomorrowNight}>
                {codesSnips[active]}
              </SyntaxHighlighter>
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
