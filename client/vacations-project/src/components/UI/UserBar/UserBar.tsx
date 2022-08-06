import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../redux/action-type";
import AppState from "../../../redux/app-state";
import AddVacation from "../../modals/AddVacation/AddVacation";
import Login from "../../modals//Login/Login";
import "./userBar.scss";
import { SocketContext } from "../../../context/socket-container";
import { motion } from "framer-motion";
import Graph from "../../modals/Graph/Graph";

function UserBar() {
  // boolean states that define when to show the modal component
  const [logInClicked, setLogInClicked] = useState<boolean>(false);
  const [addVacationClicked, setAddVacationClicked] = useState<boolean>(false);
  const [graphClicked, setGraphClicked] = useState<boolean>();

  // redux and socket.io credentials
  let userType = useSelector((state: AppState) => state.userType);
  let dispatch = useDispatch();
  let socket = useContext(SocketContext);

  // when the user log out 
  // delete token and disconnect socket.io
  const onLogOutClicked = () => {
    dispatch({ type: ActionType.LogOut });
    localStorage.removeItem("token");
    socket.emit("disconnect");
  };

  
  return (
    <div className="UserBar">
      <div className="logIn-bar">
        {userType == null && (
          <div className="logIn-area">
            {/* <p className="logIn-desc">Click to</p> */}
            <motion.input
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              className="logIn-Btn"
              value={"LogIn / Register"}
              onClick={() => setLogInClicked(true)}
            />
          </div>
        )}
        {userType != null && (
          <div className="logOut">
            <motion.input
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              className="logOut-Btn"
              value={"Logout"}
              name=""
              id=""
              onClick={onLogOutClicked}
            />
          </div>
        )}
        {userType == "admin" && (
          <div className="addCard">
            <motion.input
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              className="addCard-Btn"
              value={"Add Vacation"}
              onClick={() => setAddVacationClicked(true)}
            />
          </div>
        )}
        {userType == "admin" && (
          <div className="graph">
            <motion.input
              animate={{ scale: 1, opacity: 1 }}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              type="button"
              className="graph-Btn"
              value={"Graph"}
              onClick={() => setGraphClicked(true)}
            />
          </div>
        )}
      </div>
      {addVacationClicked && (
        <AddVacation closedModal={setAddVacationClicked} />
      )}
      {graphClicked && <Graph closedModal={setGraphClicked} />}
      {logInClicked && <Login closedModal={setLogInClicked} />}
    </div>
  );
}

export default UserBar;
