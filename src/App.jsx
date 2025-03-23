import React from "react";
import Home from "./components/Home";
import CustomizeShape from "./Pages/CustomizesShape"
import Shape3D from "./Pages/Shape3D";
import Docs from "./Pages/Docs";
import Models3D from "./Pages/Models3d";
import CustomizeModel from "./Pages/CustomizeModel";
import UploadModel from "./Pages/UploadModel"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Docs />} />
        <Route path="/shapes3d" element={<Shape3D />} />
        <Route path="/customizeshape" element={<CustomizeShape />} />
        <Route path="/customizemodel" element={<CustomizeModel />} />
        <Route path="/3dmodels" element={<Models3D />} />
        <Route path="/uploadModel" element={<UploadModel />} />
      </Routes>
    </Router>
  );
};

export default App;