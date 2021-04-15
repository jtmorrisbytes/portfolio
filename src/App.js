import React, { useEffect, useState } from "react";
// import About from "./components/Banner";
import Nav from "./components/Nav";
// import Contact from "./components/Contact";
// import Footer from "./components/Footer";
import Projects from "./components/Projects/functional";
// import "../public/preview-960.png"
// import Routes from "./routes";

// import { HashRouter, Switch, Route } from "react-router-dom";

import "./App.css";
import Banner from "./components/Banner";

import apiClient from "./lib/apiClient";
import UserContext from "./lib/userContext";

function App() {
  // grab user info on launch
  const [user, setUserView] = useState(null);
  useEffect(() => {
    // get the aggregated user data from the api server
    apiClient
      .get("/user")
      .then((response) => {
        setUserView(response.data);
      })
      .catch((e) => {
        console.error("getUser failed in App", e);
      });
  }, []);

  return (
    <div className="App">
      {/* display admin panel */}
      <UserContext>
        <Nav user={user} />
        <Banner user={user} />
        <Projects user={user} />
      </UserContext>
    </div>
  );
}

export default App;
