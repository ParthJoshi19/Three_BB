import React from "react";
import Home from "./components/Home";
import BottleModel from "./components/Model";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import Scene from './components/Model2'
import Shape3D from "./Pages/Shape3D";
import Docs from "./Pages/Docs";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Docs />} />
        <Route path="/shapes3d" element={<Shape3D />} />
      </Routes>
    </Router>
  );
};

export default App;
