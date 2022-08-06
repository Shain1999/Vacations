import React, {
  ChangeEvent,
  SetStateAction,
  useContext,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import "./login.scss";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../redux/action-type";
import { ConnectContext } from "../../../context/socket-container";
import jwt from "jwt-decode";
import { motion } from "framer-motion";

export interface IModal {
  setLogInClicked: React.Dispatch<React.SetStateAction<boolean>>;
}
function Login({ closedModal }: any) {
  let dispatch = useDispatch();
  const [cancelClicked, setCancelClicked] = useState(false);
  // defining input state
  const [userName, setUserName] = useState("");
  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // on change function that updates the state for each input
  const onUserNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentUserName = event.target.value;
    setUserName(currentUserName);
  };
  const onUserNameChangedLogin = (event: ChangeEvent<HTMLInputElement>) => {
    let currentUserName = event.target.value;
    setLoginUserName(currentUserName);
  };
  const onFirstNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentFirstName = event.target.value;
    setFirstName(currentFirstName);
  };
  const onLastNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentLastName = event.target.value;
    setLastName(currentLastName);
  };

  const onPasswordChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentPassword = event.target.value;
    setPassword(currentPassword);
  };
  const onPasswordChangedLogin = (event: ChangeEvent<HTMLInputElement>) => {
    let currentPassword = event.target.value;
    setLoginPassword(currentPassword);
  };
  // socket io connector
  const connect: Function = useContext(ConnectContext);
  // validating login data
  const validateDataLogin = () => {
    if (loginUserName == "" || loginPassword == "") {
      return false;
    }
  };
  // validating register data
  const validateDataRegister = () => {
    if (userName == "" || password == "" || firstName == "" || lastName == "") {
      return false;
    }
  };
  // when the user clicks login btn
  const onLoginClicked = async () => {
    if (validateDataLogin() == false) {
      alert("username or password must be filled");
      return;
    }
    let loginData = { userName: loginUserName, password: loginPassword };
    // send a http request to get token
    try {
      let response = await axios.post(
        "http://localhost:3001/users/login",
        loginData
      );
      if (!response) {
        alert("failed to login");
      }
      // success
      let serverResponse = response.data;
      // defining token 
      let token = "Bearer " + serverResponse.token;
      let decodedToken = jwt(serverResponse.token);
      // injecting all the packets headers with the token value
      axios.defaults.headers.common["Authorization"] = token;
      localStorage.setItem("token", token);
      // connection token to socket io component
      connect(token);

      // updation redux store with new login data
      dispatch({ type: ActionType.Login, payload: decodedToken });

      closedModal(false);
    } catch (e) {
      // failed
      console.error(e);
      alert(e);
    }
    // enriching vacation data accourding to the user
    if (localStorage.getItem("token") != null) {
      try {
        let response = await axios.get(
          `http://localhost:3001/vacations/enrich`
        );

        if (response) {
          dispatch({
            type: ActionType.enrichVacations,
            payload: response.data,
          });
        }
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  };
  // when the user clicks on register btn
  const onRegisterClicked = async () => {
    if (validateDataRegister() == false) {
      alert("all fields must be filled");
      return;
    }
    let registerData = { userName, password, firstName, lastName };
    setFirstName("");
    setLastName("");
    setUserName("");
    setPassword("");
    // send a http request to add user to db
    try {
      // success
      let response = await axios.post(
        `http://localhost:3001/users`,
        registerData
      );
      if (response.status == 200) {
        alert("succeesful register");
      }
    } catch (error) {
      // failed
      console.error(error);
      alert(error);
    }
    closedModal(false);
  };
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.5 }}
      className="LogIn"
    >
      <div className="wrapper">
        <div className="logIn-content">
          <div className="logIn-header">
            <p className="logIn-title">Log In</p>
          </div>

          <div className="logIn-container">
            <input
              type="text"
              className="logIn-input"
              placeholder="Username"
              onChange={onUserNameChangedLogin}
              required
            />
            <input
              type="password"
              className="logIn-input"
              placeholder="Password"
              onChange={onPasswordChangedLogin}
              required
            />
            <div className="buttonControlDiv">
              <input
                type="button"
                className="logIn-button"
                value="login"
                onClick={onLoginClicked}
                required
              />
            </div>
          </div>
          <div className="logIn-exit">
            <input
              type="button"
              value="Cancel"
              className="logIn-cancelBtn"
              onClick={() => closedModal(false)}
            />
          </div>
        </div>
        <div className="register-content">
          <div className="logIn-header">
            <p className="logIn-title">Register</p>
          </div>
          <div className="logIn-container">
            <input
              type="text"
              placeholder="First Name"
              className="logIn-input"
              required
              onChange={onFirstNameChanged}
              value={firstName}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="logIn-input"
              required
              onChange={onLastNameChanged}
              value={lastName}
            />
            <input
              type="text"
              placeholder="Username"
              className="logIn-input"
              required
              onChange={onUserNameChanged}
              value={userName}
            />
            <input
              type="password"
              placeholder="Password"
              className="logIn-input"
              required
              onChange={onPasswordChanged}
              value={password}
            />
            <div className="register-submit">
              <input
                type="button"
                value={"Register"}
                className="register-button"
                onClick={onRegisterClicked}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
