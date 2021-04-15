console.log("posts router starting up");
const express = require("express");
// const octoclient = require("../lib/octoclient");
// const axios = require("axios");
const octoGraphql = require("../lib/octoGraphql");
const { default: Axios } = require("axios");

// const cheerio = require("cheerio");
// const { rpop } = require("../lib/redis");

const mountPath = "/projects";
const projects = express.Router();
// check that the database is available
const { GITHUB_AUTH_TOKEN } = process.env;

projects.use((req, res, next) => {
  if (req.app.get("db") == null) {
    res.status(500).json({ message: "Database Unavailable" });
  } else {
    next();
  }
});
// fetch this data for each user repository
const UserRepoTemplate = `
      $$REPONAME$$:repository(name:"$$REPONAME$$") {
        name,
        description,
        url,
        homepageUrl,
        primaryLanguage {
          name
        }
      }

`;

// we dont have a database set up yet, so store them as an array
let orgsTofetch = ["aspiesolutions", "ProjectBlackBird"];
let userRepos = ["portfolio"];

// graphql is best for this endpoint
// because github is sending more data than neccessary

projects.get("/", async (req, res) => {
  // get all projects listed in the database
  let first = 50;
  try {
    first = parseInt(req.query.first);
  } catch {
    console.warn(" /user, req.query.first was not an integer");
  }
  let user = null;
  try {
    // try to get the user from the api token
    user = (await octoGraphql(`query{viewer{login}}`))?.viewer?.login;
  } catch (e) {
    // we need this data, so we fail fast. return here to prevent further processing of request
    console.error(
      "Failed to fetch user profile from octoGraphql using api token!",
      e
    );
    return res
      .status(500)
      .json({ message: "Fetch user from api token failed! See server log." });
  }
  if (user == null) {
    // the request didnt throw but the requested user was not found. return an error
    return res.status(500).json({
      message: "Unable to find User login using graphql from api token",
    });
  }
  // we know the users profile, so now we need a multipart request
  // we have to stitch together a multipart request based on the requested repos and orgs

  let query = `
    query {
      ${user}: viewer {
        ${(() => {
          let repoQuery = "";
          for (let repo of userRepos) {
            repoQuery += UserRepoTemplate.replace(/\$\$REPONAME\$\$/g, repo);
          }
          return repoQuery;
        })()}
      }
      Aspiesolutions: organization(login: "aspiesolutions") {
        name
        websiteUrl
        email
        description
        location
        dtdiscoveredtreasures:repository(name:"David-Teresa-Discovered-Treasures") {
          name,
          description,
          homepageUrl,
          url,
          isPrivate
        }
      }

      ProjectBlackBird: organization(login:"Project-Black-Bird") {
        name,
        websiteUrl,
        email,
        description,
        location,
        BlackBirdReviews:repository(name:"black-bird-reviews") {
          name,
          description,
          homepageUrl,
          url,
          isPrivate
        }
      }
    }
  `;

  octoGraphql(query)
    .then((data) => {
      res.json(data);
    })
    .catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
});

module.exports = { path: mountPath, router: projects };
