import React, { useEffect } from "react";
import { Chart, registerables, Ticks } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import AppState from "../../../redux/app-state";
import IVacation from "../../models/IVacation";
import { motion } from "framer-motion";
import "./graph.scss";
import axios from "axios";

Chart.register(...registerables);

function Graph(props: any) {
  let currentVacationsState: IVacation[];
  let updatedVacations = useSelector(
    (state: AppState) => state.enrichVacationsArray
  );
  let vacations = useSelector((state: AppState) => state.vacations);
  currentVacationsState =
    updatedVacations != null ? updatedVacations : vacations;

  const getAllVacationsDestinations = () => {
    let destinationArray: string[] = [];
    currentVacationsState.forEach((vacation) => {
      destinationArray.push(vacation.destination);
    });
    return destinationArray;
  };
  const getAllFollowersOnVacations = () => {
    let followersArray: number[] = [];
    currentVacationsState.forEach((vacation) => {
      followersArray.push(vacation.amountOfFollowers);
    });
    return followersArray;
  };
  let destinationArray = getAllVacationsDestinations();
  let followersArray = getAllFollowersOnVacations();

  return (
    <div className="Graph">
      <div className="wrapperGraph">
        <p className="graphTitle">Graph</p>
        <Bar
          className="graphBar"
          data={{
            labels: destinationArray,
            datasets: [
              {
                label: "Followers",
                backgroundColor: "rgb(2, 99, 132)",
                borderColor: "rgb(2, 99, 132)",
                hoverBackgroundColor: `#c1c8e4`,
                data: followersArray,
              },
            ],
          }}
          options={{
            layout: {
              padding: 20,
            },
            scales: {
              x: {
                grid: { color: "#242581" },
                ticks: { color: "#000" },
              },
              y: { grid: { color: "#242582" }, ticks: { color: "#000" } },
            },
            color: "#fff",
          }}
        ></Bar>
        <input
          type="button"
          className="exitBtn"
          value={"Exit"}
          name=""
          id=""
          onClick={() => {
            props.closedModal(false);
          }}
        />
      </div>
    </div>
  );
}

export default Graph;
