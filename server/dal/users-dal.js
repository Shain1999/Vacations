const connection = require("./dbconfig");
const ErrorType=require('../filters/error-types')

const ServerError = require("../filters/server-error");

async function login(user) {
    let sql = `SELECT * from users where username = ? and password = ?`;
    let parameters = [user.userName, user.password];
    let [userData] = await connection.executeWithParameters(sql, parameters);
    if (!userData) {
        return null;
    }
    return userData;
}
async function isUserNameExist(userName) {
    let sql = "SELECT id from users where username = ?";
    let parameters = [userName];
    let users = await connection.executeWithParameters(sql, parameters);

    if (users && users.length > 0) {
        return true;
    }
    return false;
}
async function addUser(userData) {
    let sql = `insert into users(id ,username, password, firstname, lastname, userType)` + `values(?, ?, ?, ?, ?, ?)`;
    let parameters = [userData.id, userData.userName, userData.password, userData.firstName, userData.lastName, userData.userType]
    try {
        await connection.executeWithParameters(sql, parameters)
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e)
    }
}

// async function getUserByUserName(userName) {
//     let sql = `SELECT * FROM users where username = ?`;
//     let parameters = userName;
//     let [userData] = await connection.executeWithParameters(sql, parameters);

//     if (!userData) {
//         throw new Error("no user with that name");

//     }
//     return userData;
// }
module.exports = {
    login,
    isUserNameExist,
    addUser
}