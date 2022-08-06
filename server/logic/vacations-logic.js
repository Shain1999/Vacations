const vacationsDal = require("../dal/vacations-dal");
const jwtDecode = require('jwt-decode');
const pushLogic = require("./push-logic")
const ServerError = require("../filters/server-error");
const ErrorType = require('../filters/error-types')

// returns all vacations
async function getAllVacations() {
    let vacations = await vacationsDal.getAllVacations();
    return vacations;
}
// returns all vacation with specific user data based on token
async function enrichVacationsByUserId(token) {
    // extraction token
    let userId = jwtDecode(token).userId;
    let vacationsIdArray;
    try {
        vacationsIdArray = await vacationsDal.enrichVacationsByUserId(userId);
        return vacationsIdArray;

    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
}
// returns a vacations based on id
async function getVacationById(id) {
    try {
        let vacation = await vacationsDal.getVacationById(id);
        return vacation;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant get vacation', e);
    }
}

async function deleteVacation(id) {
    try {
        await vacationsDal.deleteVacationLikes(id)
        await vacationsDal.deleteVacation(id)
        pushLogic.broadcast("delete-vacation", id);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant delete vacation', e);
    }

}
async function updateVacation(vacationData, vacationId) {
    validateVacationData(vacationData);
    try {
        await vacationsDal.updateVacation(vacationData, vacationId)
        pushLogic.broadcast('update-vacation', { vacationData, vacationId });
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant update vacation', e);
    }
}

async function addVacation(vacationData) {
    // validating data from client
    validateVacationData(vacationData);
    // generating new id
    vacationData.id = Date.now() % 100000;
    // checking if vacation already exist
    if (await vacationsDal.isVacationDestinationExist(vacationData.destination)) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'destination already exist');
    }
    try {
        await vacationsDal.addVacation(vacationData)
        pushLogic.broadcast('add-vacation', vacationData);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant add vacation', e);
    }
}

function validateVacationData(vacationData) {
    if (!vacationData.destination) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid destination');
    }
    if (!vacationData.price) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid price');
    }
    if (!vacationData.imgUrl) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid imgURL');
    }
    if (!vacationData.startDate) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid startDate');
    }
    if (!vacationData.endDate) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'invalid endDate');
    }
}

module.exports = {
    getAllVacations,
    getVacationById,
    addVacation,
    deleteVacation,
    enrichVacationsByUserId,
    updateVacation
}