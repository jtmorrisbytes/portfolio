const express = require("express");

const posts = express.Router();
const mountPath = "/post";

module.exports = { path: mountPath, router: posts };
