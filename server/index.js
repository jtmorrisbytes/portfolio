require("dotenv").config();
const express = require("express");
const path = require("path");
// const JSDOM = require('jsdom').JSDOM
const fs = require("fs");
const server = express();

const {
  SERVER_HOST,
  SERVER_PORT,
  HOST,
  PORT,
  DATABASE_URL,
  NODE_ENV,
} = process.env;

const ROOT = path.join(__dirname, "..");
const HTML_ROOT = path.join(ROOT, "build");

server.set("fsroot", ROOT);
server.set("htmlRoot", HTML_ROOT);

console.log("setup api router");
const api = require("./api");

server.use(api.path, api.router);

if (NODE_ENV === "production") {
  // serve static in production
  server.use(express.static(HTML_ROOT));
  server.get("*", (req, res) => {
    // console.log("is user authenticated",req.isAuthenticated() || "NO")
  });
}

// setup the database, then start the server
const massive = require("massive");
massive({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  // create a reference to the database instance inside server
  server.set("db", db);
  server.listen(SERVER_PORT || PORT, SERVER_HOST || HOST || "0.0.0.0", () => {
    console.log(`listenting on ${SERVER_HOST}:${SERVER_PORT}`);
  });
});
