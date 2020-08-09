import React, { Component } from "react";
import axios from "axios";
import { API_URL } from "../Constants";

const reader = new FileReader();
export default class PredictImage extends Component {
  state = {
    image: null,
    result: "",
    alert: false,
  };
  predict = () => {
    const { image } = this.state;
    const data = { image_txt: image };
    axios
      .post(API_URL + "predict", data)
      .then((response) => {
        let alert = false;
        if (response.data === "fire") alert = true;
        this.setState({ result: response.data, alert });
      })
      .catch((e) => {
        console.log("error", e);
      });
  };
  render() {
    const { alert, image, result } = this.state;
    return (
      <div className={``}>
        <div className={`dataCard ${alert && "fire-alert"}`}>
          <h1>Predict Image</h1>
          <div className="row">
            <div className="col-md-12">
              <div className="col">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      reader.readAsDataURL(e.target.files[0]);
                      reader.onload = () => {
                        console.log("base64", reader.result);
                        this.setState(
                          { image: reader.result, alert: false },
                          this.predict
                        );
                      };
                    } else {
                      this.setState({ image: null, alert: false });
                    }
                  }}
                />
              </div>

              {image && (
                <div className="col">
                  <img src={image} width={600} style={{ marginTop: "10px" }} />
                </div>
              )}
              {image && result && (
                <div className="col">
                  <span>Prediction : </span>
                  <span style={{ fontWeight: "bold" }}>{result}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
