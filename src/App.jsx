import React from "react";
import Home from "./components/Home";
import BottleModel from "./components/Model";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import Scene from './components/Model2'
import Scene from "./components/sample";
import Docs from "./Pages/Docs";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Docs />} />
      </Routes>
    </Router>
    // <Canvas>
    //   <ambientLight />
    //   <pointLight position={[0, 0, 0]} />
    //   <Model />
    // </Canvas>
    // <Scene/>
    // <BottleModel/>
  );
};

export default App;
