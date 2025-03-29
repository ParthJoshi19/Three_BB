import { useState, useRef, useEffect, Suspense } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Text,
  Html,
  RoundedBox,
  Loader,
} from "@react-three/drei";
import { ParticleSystem } from "../components/ui-3d/particle-system";

export default function Chatbot3D() {
  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <Canvas shadows camera={{ position: [0, -2, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <ChatbotScene />
          <ParticleSystem
            count={1000}
            color={"#FFFFFF"}
            size={0.15}
            speed={0.0005}
          />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      <Loader />
      {/* Mobile controls overlay */}
      <div className="fixed bottom-4 left-0 right-0 md:hidden flex justify-center gap-4 z-10">
        <button className="bg-blue-500 p-2 rounded-full">
          <span className="sr-only">Zoom In</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-zoom-in"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="11" x2="11" y1="8" y2="14" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </button>
        <button className="bg-blue-500 p-2 rounded-full">
          <span className="sr-only">Zoom Out</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-zoom-out"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ChatbotScene() {
  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs
  const panelRef = useRef();
  const chatContainerRef = useRef();

  // Three.js hooks
  const { viewport } = useThree();

  // Panel dimensions
  const panelWidth = Math.min(viewport.width * 0.8);
  const panelHeight = Math.min(viewport.height * 0.8);

  // AI setup
  const apiKey = "AIzaSyCltdm18FJWrQGJ1KPbIPsk0UhuBodykbk";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
    systemInstruction: `You are an expert Three.js developer with 5 years of experience. Your role is to analyze, correct, and optimize Three.js code as per the user's requirements.

1. **Understand User's Request**: If the issue is unclear, ask for more details before fixing the code.
2. **Code Correction & Optimization**: Fix syntax, logic, and rendering issues while ensuring efficient use of WebGLRenderer, Camera, Scene, Lights, and Materials.
3. **Explain Fixes**: Briefly describe the changes made and provide best practices when needed.
4. **Follow User Preferences**: Modify only as per user requests unless a critical issue is found.

Format responses as:
✅ **Fixed Code**:
\`\`\`js
// Corrected Three.js code
\`\`\`
`,
  });

  // Message handling
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const chatSession = model.startChat({
        history: [],
      });
      const result = await chatSession.sendMessage(`${input}`);
      const botMessage = {
        sender: "bot",
        text: result.response.text() || "Couldn't generate a response.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Error: Couldn't generate a response." },
      ]);
    }
    setLoading(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Panel animation
  useFrame(() => {
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(Date.now() * 0.0005) * 0.05;
    }
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        castShadow
      />

      <group ref={panelRef} position={[0, 0, 0]}>
        <RoundedBox
          args={[panelWidth * 0.8, panelHeight * 1, 0.1]}
          radius={0.1}
          smoothness={4}
          position={[0, 0.5, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#1f2937"
            metalness={0.5}
            roughness={0.2}
            envMapIntensity={1}
          />
        </RoundedBox>

    
        <Text
          position={[0, panelHeight / 2 - 0.15, 0.06]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
        >
          3D THREE.JS EXPERT CHATBOT
        </Text>

        <Html
          position={[0, 0, 0.06]}
          transform
          scale={0.18}
          rotation={[0, 0, 0]}
          style={{ width: `${panelWidth}`, height: `${panelHeight}` }}
        >
          <div
            className={`flex flex-col w-screen justify-end h-screen bg-transparent`}
          >
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto w-screen h-screen p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2  rounded-lg flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-[80%] rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500"
                        : "bg-gray-700 text-left"
                    }`}
                  >
                    <strong>
                      {msg.sender === "user" ? "You:" : "Gemini:"}
                    </strong>
                    {!msg.text.includes("```js") && (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}

                    {msg.text.includes("```js") && (
                      <div>
                        <div style={{ whiteSpace: "pre-wrap", width: "100%" }}>
                          <ReactMarkdown>
                            {msg.text.split("```js")[0]}
                          </ReactMarkdown>
                        </div>

                        <div
                          className="p-2 relative bg-gray-900 text-white rounded-lg"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          <button
                            onClick={() =>
                              copyToClipboard(
                                msg.text.match(/```js([\s\S]*?)```/)[1]
                              )
                            }
                            className="mt-1 absolute right-2.5 bg-gray-600 text-white px-2 py-1 rounded text-sm hover:bg-gray-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-clipboard"
                            >
                              <rect
                                width="8"
                                height="4"
                                x="8"
                                y="2"
                                rx="1"
                                ry="1"
                              />
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            </svg>
                          </button>
                          {msg.text.match(/```js([\s\S]*?)```/)[1]}
                        </div>
                        <ReactMarkdown>
                          {msg.text.split("```")[2]}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter Three.js code..."
                  className="flex-1 p-2 rounded-lg text-black whitespace-pre-wrap break-words bg-white"
                  rows="3"
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-lg h-fit"
                  disabled={loading}
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Floor */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#111827" />
      </mesh> */}
    </group>
  );
}
