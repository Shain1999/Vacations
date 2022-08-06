const express = require("express")
const http = require("http")
const jwt_decode = require('jwt-decode')
const expressServer = express()
const httpServer = http.createServer(expressServer)
// creating new socket io server
const socketIO = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
})
// connection the socket server to the http server
const socketServer = socketIO.listen(httpServer)

// the map holds user id as key and socket data as value
let userIdToSocketsMap = new Map()

// this function fires when a client connects to the socket
socketServer.sockets.on("connection", socket => {
    try {
        
        let userId = extractUserId(socket)
        // adding user id and socket data to the map
        userIdToSocketsMap.set(userId, socket)
        console.log(`${userId} has been connected, Total clients: ${userIdToSocketsMap.size}`)
        // deleting client from map
        socket.on("disconnect", () => {
            let userId = extractUserId(socket)
            disconnect(userId)
        })
        // uppon error
        socket.on("error", function () {
            console.log("skdjhaskdhsjka")
        })

    }
    catch (e) {
        console.error(e)
    }
})
// this function sends the socket data to all users in the map
function broadcast(actionName, data) {
    // validating if map is empty
    if (!userIdToSocketsMap) {
        return
    }

    if (userIdToSocketsMap.length == 0) {
        return
    }
    // for each user connected to the socket emitting the given function
    for (let socket of userIdToSocketsMap.values()) {
        try {
            socket.emit(actionName, data)
        }
        catch (e) {
            // Intentionally swallowing the exception
            // Preventing a situation where an error with the 2nd socket, will prevent
            // sending to the 3rd, fourth etc. 
            console.error(e)
        }

    }
}

function disconnect(userId) {
    userIdToSocketsMap.delete(userId)
    console.log(`${userId} client has been disconnected. Total clients: ${userIdToSocketsMap.size}`)
}

function extractUserId(socket) {
    var handshakeData = socket.request
    let token = handshakeData._query.token;
    if (!token) {
        throw new Error("Invalid token")
    }

    let decoded = jwt_decode(token)
    let userId = decoded.userId
    return userId
}

httpServer.listen(3002, () => console.log("Socket.IO works, listening..."))

module.exports = {
    broadcast,
    disconnect
}