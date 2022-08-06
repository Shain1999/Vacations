import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import IVacation from "../../models/IVacation";
import "./card.scss";
import { FaEdit, FaEraser } from "react-icons/fa";
import EditCard from "../../modals/EditCard/EditCard";
import { useDispatch, useSelector } from "react-redux";
import AppState from "../../../redux/app-state";
import axios from "axios";
import { ActionType } from "../../../redux/action-type";
import jwt from "jwt-decode";
import { SocketContext } from "../../../context/socket-container";
import { motion } from "framer-motion";

export interface IProps {
  vacation: IVacation;
  adminClicked: any;
  userClicked: any;
}

function Card(props: IProps) {
  // redux credentials
  let dispatch = useDispatch();
  let userType = useSelector((state: AppState) => state.userType);
  // fetching token
  let token = localStorage.getItem("token");
  // boolean state that decides when to show the edit card modal
  const [adminEditClicked, setAdminEditClicked] = useState<boolean>(false);
  // defining card credentials
  const [amountOfFollowers, setAmountOfFollowers] = useState<number>(
    props.vacation.amountOfFollowers
  );
  let vacationId = props.vacation.id;
  const [followedChecked, setFollowedChecked] = useState<boolean>(
    props.vacation.isFollowed == 1 ? true : false
  );
  // a function that delete a vacation from the db
  const deleteVacation = async () => {
    try {
      let response = await axios.delete(
        `http://localhost:3001/vacations/:${vacationId}`
      );
      dispatch({ type: ActionType.DeleteVacation, payload: vacationId });
      alert("vacation deleted");
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    setFollowedChecked(() => (props.vacation.isFollowed == 1 ? true : false));
  }, []);

  // a function that updates the followed state and sends an update http request
  const onFollowClicked = async (e: ChangeEvent<HTMLInputElement>) => {
    props.userClicked(true);
    // defining an object to send with the http request
    let objToSend = {
      id: vacationId,
      destination: props.vacation.destination,
      isFollowed: 0,
      amountOfFollowers: props.vacation.amountOfFollowers,
      price: props.vacation.price,
      imgUrl: props.vacation.imgUrl,
      startDate: props.vacation.startDate,
      endDate: props.vacation.endDate,
    };
    // checking the state of the checkbox
    if (e.target.checked === true) {
      try {
        // adding vacation data to user followed vacations
        let followedVacationData = { vacationId, token };
        let response = await axios.post(
          `http://localhost:3001/followedVacations`,
          followedVacationData
        );
        console.log(response.data);
      } catch (e) {
        console.error(e);
        alert(e);
      }
      objToSend.isFollowed = 1;
      // updating redux
      dispatch({ type: ActionType.FollowVacation, payload: objToSend });
      // updating the current card state
      setAmountOfFollowers(amountOfFollowers + 1);
    } else {
      try {
        // if the user unfollows delete vacation data from user followed vacation
        let response = axios.delete(
          `http://localhost:3001/followedVacations/:${token},${vacationId}`
        );
      } catch (error) {
        console.error(error);
        alert(e);
      }

      objToSend.isFollowed = 0;
      // updating redux
      dispatch({ type: ActionType.unFollowVacation, payload: objToSend });
      // updating current card state
      setAmountOfFollowers(amountOfFollowers - 1);
    }
    // updating current card state
    setFollowedChecked((prev) => !prev);
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.5 }}
      className="Card"
      style={{ backgroundImage: `url(${props.vacation.imgUrl})` }}
    >
      <div className="modalsDiv">
        {adminEditClicked && (
          <EditCard
            vacation={props.vacation}
            modalClosed={setAdminEditClicked}
            adminClicked={props.adminClicked}
          />
        )}
      </div>
      <div className="card-container">
        <div className="content">
          {userType == "admin" && (
            <div className="adminControls">
              <FaEdit color="white" onClick={() => setAdminEditClicked(true)} />

              <FaEraser color="red" onClick={() => deleteVacation()} />
            </div>
          )}
          <div className="flexDiv">
            <p className="card-vacationValue title">
              {props.vacation.destination}
            </p>
          </div>
          <div className="flexDiv">
            <p className="card-vacationValue">
              Price: {props.vacation.price} $
            </p>
          </div>
          <div className="flexDiv">
            <div className="card-vacationValue">
              <p className="controlHoverP">From</p>
            </div>
            <div className="card-vacationValue">
              <p className="controlHoverP">Untill</p>
            </div>
          </div>

          <div className="flexDiv">
            <p className="card-vacationValue">{props.vacation.startDate}</p>
            <p className="card-vacationValue">{props.vacation.endDate}</p>
          </div>
          <div className="flexDiv">
            {userType == "customer" && (
              <p className="card-vacationValue">
                Followed
                <input
                  type="checkbox"
                  name="followCheck"
                  id=""
                  defaultChecked={props.vacation.isFollowed == 1}
                  className="followedCheckBox"
                  checked={followedChecked}
                  onChange={onFollowClicked}
                />
              </p>
            )}
          </div>
          <div className="flexDiv">
            <p className="card-vacationValue">Following:{amountOfFollowers}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
