import React from "react";
import axios from "axios";
import logo from "./logo.svg";
import WebCam from "./webcam";
import ExtractFrames from "./analyseVideo";
import PredictImage from "./predictImage";
import { API_URL } from "./Constants";

import "./App.css";

function App() {
  const sendNotification = () => {
    axios
      .post(API_URL + "sendNotification", {
        email: "salmanmal00@gmail.com",
        mobile: "6692819690",
      })
      .then((response) => {
        console.log(response.data);
      });
  };
  return (
    <div className="App">
      <button onClick={sendNotification}></button>
      <WebCam />
      <PredictImage />
      <ExtractFrames />
    </div>
  );
}

export default App;
