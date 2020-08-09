import React from "react";
import WebCam from "./webcam";
import ExtractFrames from "./analyseVideo";
import PredictImage from "./predictImage";


import "./App.css";

function App() {
  return (
    <div className="App">
      <WebCam />
      <PredictImage />
      <ExtractFrames />
    </div>
  );
}

export default App;
