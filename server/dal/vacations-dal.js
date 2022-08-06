const connection = require("./dbconfig");
const ServerError = require("../filters/server-error");
const ErrorType = require('../filters/error-types')


async function getAllVacations() {
    let sql = `select *,(select count(userID) from followedvacations l where l.vacationID = v.id) as amountOfFollowers
    FROM vacations v `
    try {
        let vacations = await connection.execute(sql);
        return vacations;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }

}
async function enrichVacationsByUserId(userId) {
    let sql = `SELECT *,
    CASE WHEN l.vacationID IS NOT NULL THEN 1
    ELSE 0
    END AS 'isFollowed',
    (select count(userID) from followedvacations l where l.vacationID = v.id) as amountOfFollowers
    FROM vacations v
    left join (select vacationID from followedvacations l where userID = ?) l on v.id = l.vacationID
    order by isFollowed DESC`;
    let parameters = [userId];

    try {
        let vacationsIdArray = await connection.executeWithParameters(sql, parameters);
        return vacationsIdArray;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}

async function getVacationById(id) {
    let sql = `SELECT * from vacations where id = ?`
    let parameters = [id];
    try {
        let vacation = await connection.executeWithParameters(sql, parameters);
        return vacation;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }

}
async function getVacationIdByDestination(destination) {
    let sql = `SELECT id from vacations where destination = ?`;
    let parameters = [destination];
    try {
        let id = await connection.executeWithParameters(sql, parameters);
        return id;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}
async function deleteVacationLikes(id) {
    let sql = `DELETE from followedvacations where vacationID = ?`;
    let parameters = [id];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}
async function deleteVacation(id) {
    // delete also liked from vacations
    let sql = `DELETE from vacations where id = ?`;
    let parameters = [id];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}
async function addVacation(vacationData) {
    let sql = `insert into vacations( id, destination, price, imgUrl, startDate, endDate) ` +
        `values(?, ?, ?, ?, ?, ?)`;
    let parameters = [vacationData.id, vacationData.destination, vacationData.price, vacationData.imgUrl, vacationData.startDate, vacationData.endDate];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}
async function isVacationDestinationExist(destination) {
    let sql = "SELECT id from vacations where destination = ?";
    let parameters = [destination];
    let vacations = await connection.executeWithParameters(sql, parameters);

    if (vacations && vacations.length > 0) {
        return true;
    }
    return false;
}
async function updateVacation(vacationData, vacationId) {
    let sql = `update vacations set destination = ?, price = ?, imgUrl = ?, startDate = ?, endDate = ? where id = ?`;
    parameters = [vacationData.destination, vacationData.price, vacationData.imgUrl, vacationData.startDate, vacationData.endDate, vacationId];
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}
module.exports = {
    getAllVacations,
    getVacationById,
    addVacation,
    isVacationDestinationExist,
    getVacationIdByDestination,
    deleteVacation,
    enrichVacationsByUserId,
    updateVacation,
    deleteVacationLikes

}