import React, { useContext } from "react";
import Title from "../../UI/Title/Title";
import UserBar from "../../UI/UserBar/UserBar";
import Vacations from "../../UI/Vacations/Vacations";
import "./main.scss";
import videoBg from "../../../assests/videos/bgVideo.mp4";
import { ConnectContext } from "../../../context/socket-container";
import jwt from "jwt-decode";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../redux/action-type";
import { connect } from "socket.io-client";
import axios from "axios";

function Main() {
  // save user state on refresh
  let dispatch = useDispatch();
  if (localStorage.getItem("token") != null) {
    let token = localStorage.getItem("token");
    let decodedToken = jwt(token);
    dispatch({ type: ActionType.Login, payload: decodedToken });
    try {
      axios.defaults.headers.common["Authorization"] = token;
      axios
        .get(`http://localhost:3001/vacations/enrich`)
        .then((response) => {
          if (response.status == 200) {
            dispatch({
              type: ActionType.enrichVacations,
              payload: response.data,
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="Main">
      <video src={videoBg} autoPlay loop muted></video>
      <div className="backgroundVideo">
        <Title />
        <UserBar />
      </div>
      <Vacations />
    </div>
  );
}

export default Main;
