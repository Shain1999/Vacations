import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import IVacation from "../../models/IVacation";
import Card from "../Card/Card";
import "./vacations.scss";
import { useDispatch, useSelector } from "react-redux";
import AppState from "../../../redux/app-state";
import { ActionType } from "../../../redux/action-type";
import { SocketContext } from "../../../context/socket-container";
import Graph from "../../modals/Graph/Graph";

function Vacations() {
  // bg img
  let imgUrl = `https://wallpapercave.com/wp/wp4291552.jpg`;
  // boolean states that tell react when to render the card after changes
  const [adminClicked, setAdminClicked] = useState<boolean>(false);
  const [userClicked, setUserClicked] = useState<boolean>(false);

  // redux and socket.io credentials
  let vacations = useSelector((state: AppState) => state.vacations);
  let dispatch = useDispatch();
  let socket = useContext(SocketContext);

  // upon loading fetching all the vacations to display
  // without any extra user data
  useEffect(() => {
    axios
      .get("http://localhost:3001/vacations/")
      .then((response) => {
        let vacationsArray = response.data;
        dispatch({ type: ActionType.GetAllVacations, payload: vacationsArray });
      })
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  }, []);

  useEffect(() => {
    // checking if there is a socket connected
    // listening to CRUD events from the server
    // updating all users connected with changes commited by another users
    // when a socket emmit is recived updates redux with given data
    if (socket) {
      socket.on("add-vacation", (vacation: IVacation) => {
        dispatch({ type: ActionType.AddVacation, payload: vacation });
      });
      socket.on("delete-vacation", (vacationId: number) => {
        dispatch({ type: ActionType.DeleteVacation, payload: vacationId });
      });
      socket.on(
        "update-vacation",
        (vacation: IVacation, vacationId: number) => {
          dispatch({
            type: ActionType.updateVacation,
            payload: { vacation, vacationId },
          });
        }
      );
      socket.on("follow-vacation", (vacationId: number, userId: number) => {
        dispatch({
          type: ActionType.FollowVacation,
          payload: { vacationId, userId },
        });
      });
      socket.on("unfollow-vacation", (vacationId: number, userId: number) => {
        dispatch({
          type: ActionType.unFollowVacation,
          payload: { vacationId, userId },
        });
      });
    }
  }, []);

  return (
    <>
      <div className="Vacations">
        <div
          className="vacations-grid"
          style={{
            backgroundImage: `url(${imgUrl})`,
          }}
        >
          {vacations.map((vacation: IVacation) => {
            return (
              <Card
                key={vacation.id}
                vacation={vacation}
                userClicked={setUserClicked}
                adminClicked={setAdminClicked}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Vacations;
