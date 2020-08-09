import axios from "axios";

export const API_URL = "http://localhost:5000/";
export const sendNotification = () => {
  axios
    .post(API_URL + "sendNotification", {
      email: "salmanmal00@gmail.com",
      mobile: "6692819690",
    })
    .then((response) => {
      console.log(response.data);
    });
};
