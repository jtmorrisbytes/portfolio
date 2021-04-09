// this is the api server module
const express = require("express");
const path = require("path");
const octoClient = require("./lib/octoclient");
const checkUserLock = require("./lib/checkUserLock");
const redis = require("./lib/redis");

const api = express.Router();
const mountPath = "/api";

// setup json parser
api.use(express.json());
api.use(require("cookie-parser")());



/*
  register a preflight request check to ensure the client
  has told the server that it can accept the response types
  that the server supports
*/
api.use(function checkResponseTypeSupported(req, res, next) {
  // this api can respond in json and text
  if (req.accepts("application/json") || req.accepts("text/plain")) {
    next();
  } else {
    res.sendStatus(415);
  }
});

/* 
 register a preflight request check to ensure the client
 has sent the request in a method that the api server accepts
  
*/

api.use(function checkRequestTypeSupported(req, res, next) {
  if (req.accepts("json")) {
    next();
  } else {
    res.status(415);
    const error = {
      message: "The client has requested a response type that is not supported",
      reason: "This server only accepts application/json",
      code: "UNSUPPORTED_RESPONSE_TYPE",
    };
    if (req.is("json")) {
      res.json(error);
    } else {
      res.send(error);
    }
  }
});
// since webpack is not being used
// we can just read the "controllers"
// directory and dynamically require() subrouters

// get a list of controllers installed on the system
console.log("getting controllers");
require("fs")
  .readdirSync(path.join(__dirname, "controllers"))
  .forEach((f) => {
    // get the controller at the specified path
    console.log("getting controller: ", f);
    let controller = require(`./controllers/${f}`);
    console.log("controller", f);
    // mount the above controller at the path specified
    // using the router given
    api.use(controller.path, controller.router);
  });

module.exports = { path: mountPath, router: api };
