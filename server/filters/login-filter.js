const expressJwt = require("express-jwt")
const config = require("../config/config.json")
const { secret } = config

function loginFilter() {
    return expressJwt({ secret, algorithms: ["HS256"] }).unless({
        path: [
            { url: "/users", method: "POST" },
            { url: "/users/login", method: "POST" },
            { url: "", method: "GET" }
        ]
    });
};

module.exports = loginFilter;