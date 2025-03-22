import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";
import { ParticleSystem } from "../components/ui-3d/particle-system";
import {
  OrbitControls,
  GradientTexture,
  Html,
  Float,
  Environment,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";

// const ParticleSystem = ({ count, color, size, speed }) => {
//   const particlesRef = useRef(null);

//   useFrame(() => {
//     if (particlesRef.current) {
//       particlesRef.current.rotation.y += speed;
//     }
//   });

//   return (
//     <group ref={particlesRef}>
//       {Array.from({ length: count }).map((_, i) => (
//         <mesh
//           key={i}
//           position={[
//             (Math.random() - 0.5) * 20,
//             (Math.random() - 0.5) * 20,
//             (Math.random() - 0.5) * 20,
//           ]}
//         >
//           <sphereGeometry args={[size * Math.random(), 8, 8]} />
//           <meshBasicMaterial color={color} transparent opacity={0.6} />
//         </mesh>
//       ))}
//     </group>
//   );
// };

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);
  // console.log(code)
  const copyToClipboard = (line) => {
    navigator.clipboard.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-left overflow-auto max-h-50 w-full">
      {copied && (
        <div className="bg-[rgba(81,84,255,0.3)] w-fit p-2 rounded-lg border-2 border-blue-600 ">
          Copied
        </div>
      )}
      {code.split("\n").map((line, i) => (
        <div key={i} className="text-gray-300 flex justify-between">
          {line}
          {!line.match("OR") && (
            <button
              onClick={() => copyToClipboard(line)}
              className=" h-8 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
            >
              <i className="ri-clipboard-line"></i>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const InstallationCard = ({ activeTab, installationSteps, setActiveTab }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabVariants = {
    inactive: { backgroundColor: "#1f2937", color: "#e5e7eb" },
    active: { backgroundColor: "#3b82f6", color: "#ffffff", scale: 1.05 },
  };

  return (
    <motion.div
      className="bg-transparent border-2 border-blue-600 rounded-xl shadow-2xl p-6 lg:w-[750px]  max-w-full"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Installation Guide
      </h2>

      <div className="flex space-x-4 mb-6">
        {Object.keys(installationSteps).map((tab, index) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(index)}
            className="px-4 py-2 rounded-md font-medium flex-1 transition-all"
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === index ? "active" : "inactive"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {index === 0 ? "React" : index === 1 ? "Next.js" : "Vanilla"}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CodeBlock code={installationSteps[activeTab]} />
      </motion.div>

      <div className="mt-6 text-gray-300 text-sm">
        <p className="mb-2">
          <span className="font-semibold text-blue-400">Tip:</span> Make sure
          you have Node.js installed before running these commands.
        </p>
        <p>
          Check out the{" "}
          <a href="#" className="text-blue-400 hover:underline">
            documentation
          </a>{" "}
          for more details.
        </p>
      </div>
    </motion.div>
  );
};

const Docs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const installationSteps = [
    "npm install three @react-three/fiber @react-three/drei",
    "npm install three @react-three/fiber @react-three/drei",
    "npm install three\n  OR \n<script src='https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js'></script>",
  ];

  return (
    <div className="w-full h-screen bg-transparent">
          <div className="z-10 text-white absolute" > BACK</div>

      <Canvas camera={{ position: [0, 0, 10], fov: 90 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#050816"]} />
        <fog attach="fog" args={["#050816", 10, 30]} />

        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <group position={[0, 0, 0]}>
          <Html transform position={[0, 0, 1]} className="pointer-events-auto">
            <InstallationCard
              activeTab={activeTab}
              installationSteps={installationSteps}
              setActiveTab={setActiveTab}
            />
          </Html>
        </group>

        <ParticleSystem
          count={1000}
          color={"#4f86f7"}
          size={0.15}
          speed={0.0002}
        />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={8}
          maxDistance={15}
        />

        <Environment preset="city" />
      </Canvas>

      <div className="absolute bottom-4 left-4 text-white text-sm opacity-70">
        Use mouse to rotate the view
      </div>
    </div>
  );
};

export default Docs;