import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import IVacation from "../../models/IVacation";
import "./editcard.scss";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { ActionType } from "../../../redux/action-type";

function EditCard(props: any) {
  let dispatch = useDispatch();

  const [newCardData, setNewCardData] = useState<IVacation>();
  const [vacationName, setVacationName] = useState<string>(
    props.vacation.destination
  );
  const [vacationPrice, setVacationPrice] = useState<number>(
    props.vacation.price
  );
  const [vacationStartDate, setVacationStartDate] = useState<string>(
    props.vacation.startDate
  );
  const [vacationEndDate, setVacationEndDate] = useState<string>(
    props.vacation.endDate
  );
  const [errMessage, setErrMessage] = useState<string>("");
  const [vacationImgUrl, setVacationImgUrl] = useState<string>(
    props.vacation.imgUrl
  );
  const [inputStartColor, setInputStartColor] = useState<string>("");
  const [inputEndColor, setInputEndColor] = useState<string>("");
  function containsNumber(str: string) {
    return /[0-9]/.test(str);
  }
  const onVacationNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
    let currentVacationName = event.target.value;
    if (currentVacationName.length < 2) {
      setErrMessage("name must be atleast 2 letters");
      event.target.style.borderColor = "red";
    } else if (currentVacationName.length > 10) {
      setErrMessage("name must be below 10 letters");
      event.target.style.borderColor = "red";
    } else if (containsNumber(currentVacationName)) {
      setErrMessage("name must contain only letters");
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
  };
  const updateVacation = async () => {
    let updateVacationData = {
      destination: vacationName,
      imgUrl: vacationImgUrl,
      price: vacationPrice,
      startDate: vacationStartDate,
      endDate: vacationEndDate,
    };
    try {
      let response = await axios.put(
        `http://localhost:3001/vacations/:${props.vacation.id}`,
        updateVacationData
      );
      let objToSend = {
        vacationId: props.vacation.id,
        vacationData: updateVacationData,
      };
      dispatch({ type: ActionType.updateVacation, payload: objToSend });

      if (response.data != null) {
        alert("vacation updated");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.5 }}
      className="EditCard"
    >
      <div className="wrapperEdit">
        {errMessage != "" && (
          <div className="errDiv">
            <p className="errMessage">{errMessage}</p>
          </div>
        )}
        <div className="editCardContent">
          <div className="editCardTitleDiv">
            <p className="editCardTitle">
              Edit {props.vacation.destination} vacation
            </p>
          </div>
          <div className="container">
            <div className="vacationParameterDiv">
              <p className="vacationPropName">Destination: </p>
              <input
                type="text"
                placeholder={props.vacation.destination}
                onChange={onVacationNameChanged}
              />
            </div>
            <div className="vacationParameterDiv">
              <p className="vacationPropName">Price: </p>
              <input
                type="number"
                placeholder={props.vacation.price}
                onChange={onVacationPriceChanged}
              />
            </div>
            <div className="vacationParameterDiv">
              <p className="vacationPropName">Img Url:</p>
              <input
                type="url"
                placeholder="Enter Img Url"
                onChange={onVacationImgUrlChanged}
              />
            </div>
            <div className="vacationParameterDiv">
              <p className="vacationPropName">Start Date: </p>
              <input type="date" onChange={onVacationStartDateChanged} />
            </div>
            <div className="vacationParameterDiv">
              <p className="vacationPropName">End Date: </p>
              <input type="date" onChange={onVacationEndDateChanged} />
            </div>
            <div className="BtnsDiv">
              <input
                className="editCard-cancelBtn"
                type="button"
                value="Cancel"
                onClick={() => {
                  props.modalClosed(false);
                }}
              />
              <input
                className="editCard-saveBtn"
                type="button"
                value="Save"
                onClick={() => {
                  props.adminClicked(true);
                  updateVacation();
                  props.modalClosed(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EditCard;
