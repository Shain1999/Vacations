const ServerError = require("../filters/server-error");
const connection = require("./dbconfig");
const ErrorType=require('../filters/error-types')

async function getAllFollowedVacationsIdByUserId(userId) {
    let sql = `SELECT vacationID from followedvacations where userID=?
    `;
    let parameters = [userId]
    let followedVacationsId = await connection.executeWithParameters(sql, parameters);
    if (followedVacationsId != null) {
        return followedVacationsId;

    }
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
}
async function getAllUsersFollowingVacationById(vacationId) {
    let sql = `SELECT * from followedvacations where vacationID=?`;
    let parameters = [vacationId];
    let usersFollowing = await connection.executeWithParameters(sql, parameters);
    if (usersFollowing != null) {
        return usersFollowing
    }
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
}
async function addVacationIdToFollowedVacations(vacationId, userId) {

    let sql = `insert into followedvacations( vacationID, userID)` + `values ( ?, ?)`;
    let parameters = [vacationId, userId];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)

    }
}
async function deleteVacationIdFromFollowedVacations(vacationId, userId) {
    let sql = `DELETE from followedvacations where vacationID = ? AND userID = ?`;
    let parameters = [vacationId, userId];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)

    }
}
async function isVacationFollowedExist(vacationId, userId) {
    let sql = "SELECT vacationID from followedvacations where vacationID = ? AND userID = ?";
    let parameters = [vacationId, userId];
    let followedVacations = await connection.executeWithParameters(sql, parameters);

    if (followedVacations && followedVacations.length > 0) {
        return true;
    }
    return false;
}
module.exports = {
    getAllFollowedVacationsIdByUserId,
    addVacationIdToFollowedVacations,
    deleteVacationIdFromFollowedVacations,
    isVacationFollowedExist,
    getAllUsersFollowingVacationById
}