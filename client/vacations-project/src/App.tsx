import React, { useContext, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import "./App.scss";
import Footer from "./components/layout/footer/Footer";
import Header from "./components/layout/header/Header";
import Main from "./components/layout/main/Main";
import SocketContainer, { ConnectContext } from "./context/socket-container";
import { store } from "./redux/store";
import { ActionType } from "./redux/action-type";

function App() {
  
// wrapping the site with the socket component and redux store provider
  return (
    <div className="App">
      <SocketContainer>
        <Provider store={store}>
          <Main />
          <Footer />
        </Provider>
      </SocketContainer>
    </div>
  );
}

export default App;
