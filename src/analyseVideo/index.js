import React, { Component } from "react";
import axios from "axios";
import { API_URL, sendNotification } from "../Constants";
import "./index.css";

function captureVideoFrames(videoId, format, quality) {
  let video = document.getElementById(videoId);

  format = format || "jpeg";
  quality = quality || 0.92;

  if (!video || (format !== "png" && format !== "jpeg")) {
    return false;
  }

  var canvas = document.createElement("CANVAS");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext("2d").drawImage(video, 0, 0);

  var dataUri = canvas.toDataURL("image/" + format, quality);
  var data = dataUri.split(",")[1];
  var mimeType = dataUri.split(";")[0].slice(5);

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var arr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  var blob = new Blob([arr], { type: mimeType });
  var result = { blob: blob, dataUri: dataUri, format: format };

  return result;
}
// export default function ExtractVideoFrames() {
//   const predict = (image) => {
//     const data = { image_txt: image };
//     axios
//       .post(API_URL + "predict", data)
//       .then((response) => {
//         console.log("prediction", response.data);
//       })
//       .catch((e) => {
//         console.log("error", e);
//       });
//   };
//   const startPredicting = () => {
//     const result = captureVideoFrames("frame-by-frame");
//     if (result) {
//       predict(result.dataUri);
//     }
//   };

//   const handleOnVideoSelect = (e) => {
//     let video = document.getElementById("frame-by-frame");
//     video.mute = true;
//     video.src = URL.createObjectURL(e.target.files[0]);
//     video.play();

//     setInterval(startPredicting, 1000);
//   };

//   return (
//     <div>
//       <input type="file" accept="video/*" onChange={handleOnVideoSelect} />
//       <video id="frame-by-frame" autoPlay loop />
//     </div>
//   );
// }

export default class ExtractVideoFrames extends Component {
  state = {
    videoSrc: null,
    clearInstance: null,
    prediction: [],
    count: 0,
    alert: false,
  };
  predict = (image) => {
    const data = { image_txt: image };
    axios
      .post(API_URL + "predict", data)
      .then((response) => {
        let { prediction, count } = this.state;
        let alert = false;
        prediction[count % 30] = response.data;
        console.log("prediction", prediction);
        const firecount = prediction.filter((i) => i == "fire").length;
        if (firecount >= 15) {
          alert = true;
          if (!this.state.alert) sendNotification();
        }
        this.setState({
          prediction,
          count: count + 1,
          alert,
        });
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  startPredicting = () => {
    const result = captureVideoFrames("frame-by-frame");
    if (result) {
      this.predict(result.dataUri);
    }
  };
  handleOnVideoSelect = (e) => {
    // let video = document.getElementById("frame-by-frame");
    if (e.target.files.length > 0) {
      this.setState(
        {
          videoSrc: URL.createObjectURL(e.target.files[0]),
          alert: false,
          clearInstance: null,
        },
        () => {
          let clearInstance = setInterval(this.startPredicting, 500);
          this.setState({ clearInstance });
        }
      );
    } else {
      let { clearInstance } = this.state;
      if (clearInstance) {
        clearInterval(clearInstance);
        clearInstance = null;
      }
      this.setState({ videoSrc: null, alert: false, clearInstance });
    }
    // video.src = URL.createObjectURL(e.target.files[0]);
    // video.play();
    // setInterval(this.startPredicting, 1000);
  };
  render() {
    const { alert, videoSrc } = this.state;

    return (
      <div className={``}>
        <div className={`dataCard ${alert && "fire-alert"}`}>
          <h1>Ananlyze Video</h1>
          <div className="row">
            <div className="col-md-12">
              <div className="col">
                <input
                  type="file"
                  accept="video/*"
                  onChange={this.handleOnVideoSelect}
                />
              </div>
              {videoSrc && (
                <div className="col">
                  <video
                    id="frame-by-frame"
                    autoPlay
                    loop
                    className="frame-by-frame"
                    src={videoSrc}
                    mute
                    width={600}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
