import axios from "axios";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../redux/action-type";
import IVacation from "../../models/IVacation";
import { IModal } from "../Login/Login";
import "./addVacation.scss";
import { motion } from "framer-motion";

function AddVacation(props: any) {
  const [vacationName, setVacationName] = useState<string>("");
  const [vacationPrice, setVacationPrice] = useState<number>(0);
  const [vacationStartDate, setVacationStartDate] = useState<string>("");
  const [vacationEndDate, setVacationEndDate] = useState<string>("");
  const [vacationImgUrl, setVacationImgUrl] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [inputStartColor, setInputStartColor] = useState<string>("");
  const [inputEndColor, setInputEndColor] = useState<string>("");
  let dispatch = useDispatch();
  // finish validate
  const validateData = () => errMessage === "";

  const addVacation = async () => {
    // temp id that will be changed in the server
    let id = Date.now() % 100000;
    let newCardObj: IVacation = {
      id: id,
      destination: vacationName,
      price: vacationPrice,
      imgUrl: vacationImgUrl,
      startDate: vacationStartDate,
      endDate: vacationEndDate,
    };
    // sending http request to add vacation
    try {
      validateData();
      let response = await axios.post(
        `http://localhost:3001/vacations/`,
        newCardObj
      );
      if (response.data != null) {
        alert("vacation added");
      }
      dispatch({ type: ActionType.AddVacation, payload: newCardObj });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  // validate user input function helpers
  function onlyLetters(str: string) {
    return /^[a-zA-Z' ']+$/.test(str);
  }
  function isImage(url: string) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }
  
  // on change handler for each input that updates the state value and showing errors
  const onVacationNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationName = event.target.value;
    if (currentVacationName.length < 2) {
      setErrMessage("name must be atleast 2 letters");
      event.target.style.borderColor = "red";
    } else if (!onlyLetters(currentVacationName)) {
      setErrMessage("name must contain letters only");
      event.target.style.borderColor = "red";
    } else {
      event.target.style.borderColor = "#5580e9";
      setErrMessage("");
    }

    setVacationName(currentVacationName);
  };
  const onVacationPriceChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationPrice = +event.target.value;
    if (currentVacationPrice < 100) {
      setErrMessage("price must be atleast 100");
      event.target.style.borderColor = "red";
    } else {
      event.target.style.borderColor = "#5580e9";
      setErrMessage("");
    }
    setVacationPrice(currentVacationPrice);
  };
  const onVacationStartDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationStartDate = event.target.value.toString();

    setVacationStartDate(currentVacationStartDate);

    if (Date.parse(currentVacationStartDate) > Date.parse(vacationEndDate)) {
      setErrMessage("start date must be before end date");
      setInputStartColor("red");
    } else {
      setInputStartColor("#5580e9");
      setErrMessage("");
    }
  };
  const onVacationEndDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationEndDate = event.target.value.toString();
    setVacationEndDate(currentVacationEndDate);
    if (Date.parse(currentVacationEndDate) < Date.parse(vacationStartDate)) {
      setErrMessage("start date must be before end date");
      setInputEndColor("red");
    } else {
      setInputEndColor("#5580e9");
      setErrMessage("");
    }
  };
  const onVacationImgUrlChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationImgUrl = event.target.value;
    setVacationImgUrl(currentVacationImgUrl);
    if (!isImage(currentVacationImgUrl)) {
      setErrMessage("imgUrl invalid");
      event.target.style.borderColor = "red";
    } else {
      event.target.style.borderColor = "#5580e9";
      setErrMessage("");
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.5 }}
      className="AddVacation"
    >
      <div className="wrapperAddVac">
        {errMessage != "" && (
          <div className="errDiv">
            <p className="errMessage">{errMessage}</p>
          </div>
        )}
        <div className="addVacTitleDiv">
          <p className="addVacationTitle">AddVacation</p>
          <div className="addVacationContainer">
            <div className="vacationPropDiv">
              <p className="vacationPropName">Destination:</p>
              <input
                name="name"
                type="text"
                placeholder="Enter Destination"
                onChange={onVacationNameChanged}
              />
            </div>
            <div className="vacationPropDiv">
              <p className="vacationPropName">Price:</p>
              <input
                name="price"
                type="number"
                placeholder="Enter Price"
                onChange={onVacationPriceChanged}
              />
            </div>
            <div className="vacationPropDiv">
              <p className="vacationPropName">Img Url:</p>
              <input
                type="url"
                name="imgUrl"
                placeholder="Enter Img Url"
                onChange={onVacationImgUrlChanged}
              />
            </div>
            <div className="vacationPropDiv">
              <p className="vacationPropName">Start Date: </p>
              <input
                name="startDate"
                type="date"
                onChange={(e) => onVacationStartDateChanged(e)}
                style={{ borderColor: inputStartColor }}
              />
            </div>
            <div className="vacationPropDiv">
              <p className="vacationPropName">End Date: </p>
              <input
                name="endDate"
                type="date"
                onChange={(e) => onVacationEndDateChanged(e)}
                style={{ borderColor: inputEndColor }}
              />
            </div>
            <div className="BtnsDiv">
              <input
                className="editCard-cancelBtn"
                type="button"
                value="Cancel"
                onClick={() => {
                  props.closedModal(false);
                }}
              />
              <input
                className="editCard-saveBtn"
                type="button"
                value="Save"
                onClick={() => {
                  addVacation();
                  props.closedModal(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AddVacation;
