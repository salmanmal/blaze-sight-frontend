import React, { useEffect } from "react";
import { API_URL, sendNotification } from "../Constants";
import axios from "axios";
import Webcam from "react-webcam";
import CameraOff from "../video-not-working.png";
// import * as captureVideoFrame from "capture-video-frame";
import "./index.css";
let final = "";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const audioElementRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [toggleCam, setToggleCam] = React.useState(true);
  let [result, setResult] = React.useState("");
  let [alert, setAlert] = React.useState(false);

  useEffect(() => {
    let clear;
    if (toggleCam && !clear) {
      clear = setInterval(capture, 1000);
    } else if (!toggleCam && clear) {
      clearInterval(clear);
    }
    return () => {
      clearInterval(clear);
    };
  }, []);

  const predict = (image) => {
    const data = { image_txt: image };
    axios
      .post(API_URL + "predict", data)
      .then((response) => {
        response.data = final + " " + response.data;
        response.data.trim();
        final = response.data;
        let predi = response.data.split(" ");
        if (predi.length >= 30) {
          predi = predi.slice(Math.max(predi.length - 30, 0));
          console.log("final arr", predi);
          if (predi.filter((i) => i == "fire").length >= 18) {
            setAlert(true);
            sendNotification();
          } else {
            setAlert(false);
          }
        }

        setResult(response.data);
      })
      .catch((e) => {
        console.log("error", e);
      });
  };
  const speak = () => {};
  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      // console.log(image);
      setImageSrc(image);
      predict(image);
    }
  }, [webcamRef]);

  return (
    // <div className={`${alert && "fire-alert"}`}>
    <div className={``}>
      <div className={`dataCard ${alert && "fire-alert"}`}>
        <h1>Live Monitoring</h1>
        <div className="row">
          <div className="col-md-12">
            {toggleCam ? (
              <div className="col">
                <Webcam
                  audio={false}
                  height={338}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={600}
                  forceScreenshotSourceSize={true}
                  videoConstraints={videoConstraints}
                  mirrored={true}
                />
              </div>
            ) : (
              <div className="col" style={{ marginBottom: "10px" }}>
                <img src={CameraOff} width={600} />
              </div>
            )}

            {toggleCam ? (
              <button
                onClick={() => {
                  setToggleCam(!toggleCam);
                  setAlert(false);
                }}
                className="webcam-controls"
                style={{ maxWidth: "600px" }}
              >
                <span className="fa-stack fa-lg icons">
                  <i className="fa fa-video-camera fa-stack-1x"></i>
                  <i
                    className="fa fa-ban fa-stack-2x"
                    title="Turn off camera"
                  ></i>
                </span>{" "}
                Stop Monitoring
              </button>
            ) : (
              <button
                onClick={() => {
                  setToggleCam(!toggleCam);
                }}
                className="webcam-controls"
                style={{ maxWidth: "600px" }}
              >
                <i
                  className="fa fa-video-camera fa-2x icons"
                  title="Turn on camera"
                  onClick={() => {
                    setToggleCam(!toggleCam);
                  }}
                ></i>{" "}
                Start Monitoring
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
