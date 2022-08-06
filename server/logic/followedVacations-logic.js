const followedVacationsDal = require("../dal/followedVacations-dal");
const jwtDecode = require('jwt-decode');
const pushLogic = require('./push-logic');
const ServerError = require("../filters/server-error");
const ErrorType = require('../filters/error-types')

// returns all followd vacation by the user
async function getAllFollowedVacationsIdByUserId(token) {
    // extracting user id from token
    let userId = jwtDecode(token).userId;
    let followedVacations = await followedVacationsDal.getAllFollowedVacationsIdByUserId(userId);
    if (followedVacations != []) {
        return followedVacations;
    }
    throw new ServerError(ErrorType.GENERAL_ERROR);
}
// returns all the users following a specific vacation

async function getAllUsersFollowingVacationById(vacationId) {

    let usersFollowing = await followedVacationsDal.getAllUsersFollowingVacationById(vacationId);
    if (usersFollowing != []) {
        return usersFollowing
    }
    throw new ServerError(ErrorType.GENERAL_ERROR);
}
// adding vacation id and user id to the followed vacations table
async function addVacationIdToFollowedVacations(followedVacationData) {
    // validating data
    validateFollowedVacationData(followedVacationData)
    // extracting user id from token
    let userId = jwtDecode(followedVacationData.token).userId;
    // checking if vacation already followed by the user
    if (await followedVacationsDal.isVacationFollowedExist(followedVacationData.vacationId, userId)) {
        throw new ServerError(ErrorType.GENERAL_ERROR);
    }
    try {
        
        await followedVacationsDal.addVacationIdToFollowedVacations(followedVacationData.vacationId, userId)
        pushLogic.broadcast('follow-vacation', { vacationId: followedVacationData.vacationId, userId })
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant follow vacation', e);
    }
}
async function deleteVacationIdFromFollowedVacations(vacationId, token) {
    // extracting id from token
    let userId = jwtDecode(token).userId;
    try {
        
        await followedVacationsDal.deleteVacationIdFromFollowedVacations(vacationId, userId)
        pushLogic.broadcast('unfollow-vacation', { vacationId, userId });
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'cant delete vacation', e);

    }
}
function validateFollowedVacationData(followedVacationData) {
    let userId = jwtDecode(followedVacationData.token).userId;

    if (!userId) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'no user id');
    }
    if (!followedVacationData.vacationId) {
        throw new ServerError(ErrorType.GENERAL_ERROR, 'no vacation id');
    }
}
module.exports = {
    getAllFollowedVacationsIdByUserId,
    addVacationIdToFollowedVacations,
    deleteVacationIdFromFollowedVacations,
    getAllUsersFollowingVacationById
}