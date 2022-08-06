const express = require("express");
const cors = require('cors');

const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const followedVacationsController = require("./controllers/followedVacations-controller");
const loginFilter = require("./filters/login-filter");
const db = require("./dal/dbconfig");
const errorHandler = require("./controllers/error-handler");
const server = express();


server.use(cors({ origin: "http://localhost:3000" }));
// server.use(cors({ origin: "http://localhost:4200" }));
server.use(express.json());
server.use("/users", usersController);
server.use("/vacations", vacationsController);
server.use("/followedvacations", followedVacationsController);
server.use(errorHandler);
server.listen(3001, () => console.log("Listening on http://localhost:3001"));

module.exports = server;