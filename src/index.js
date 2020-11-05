import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
// const githubWorker = new Worker('githubApiWorker.js')

// window.addEventListener('unload',()=>{console.log("terminating worker");githubWorker.terminate(); window.githubWorker = undefined;})
// window.githubWorker = githubWorker

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
