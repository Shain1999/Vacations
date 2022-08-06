import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = React.createContext(null);
export const ConnectContext = React.createContext(null);

// creating a socket container for the whole site

export default function SocketContainer({ children }: any) {
  let [socket, setSocket] = useState(null);
  let connect: Function = (token: string) => {
    // let newSocket = io("http://localhost:3002", {
    //     extraHeaders: { token }
    // });
    let newSocket = io("http://localhost:3002", {
      query: { token },
      // transports: ["websocket"]
    });
    setSocket(newSocket);
    console.log("Successful websocket connection");
  };

  useEffect(() => {
    if (!socket) {
      let token = localStorage.getItem("token");
      if (token) {
        connect(token);
      }
    }
  }, []);
// by wraping the whole site (children) data with socket and context provider all the children can share the socket io data
  return (
    <SocketContext.Provider value={socket}>
      <ConnectContext.Provider value={connect}>
        {children}
      </ConnectContext.Provider>
    </SocketContext.Provider>
  );
}
