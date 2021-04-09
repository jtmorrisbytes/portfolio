console.log("posts router starting up");
const express = require("express");
const octoclient = require("../lib/octoclient");
const axios = require("axios");
const octoGraphql = require("../lib/octoGraphql");
const { default: Axios } = require("axios");

const cheerio = require("cheerio");

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

// graphql is best for this endpoint
// because github is sending more data than neccessary

projects.get("/", (req, res) => {
  // get all projects listed in the database
  octoGraphql(
    `query { 
      viewer { 
        login,
        name,
        url,
        avatarUrl,
        bio,
        company,
        email,
        isHireable,
        repositories(privacy:PUBLIC,first:100) {
         nodes {
          homepageUrl,
          name,
          description,
          url,
          primaryLanguage {
            name
          }
        } 
        }
        organizations(first:5) {
          nodes {
            repositories(privacy:PUBLIC,first:100) {
              nodes {
                homepageUrl,
                name,
                description,
                url,
                primaryLanguage {
                  name
                }
              }
            }
          }
        }
      }
    }`
  )
    .then((response) => {
      console.log(response);
      let repos = response.viewer?.repositories?.nodes || [];

      // filter repos based on requirements
      // repos must have:
      // 1. a name:
      // 2. a description
      // 3. a homepage
      // 4  a github repo link

      // checking typeof requirement === string
      return (
        repos
          .filter(
            (r) =>
              typeof r.name === "string" &&
              typeof r.description === "string" &&
              typeof r.homepageUrl === "string" &&
              typeof r.url === "string"
          )
          // the entries are only valid if the length of the string is greater than 0
          .filter(
            (r) =>
              r.name.length > 0 &&
              r.description.length > 0 &&
              r.homepageUrl.length > 0 &&
              r.url.length > 0
          )
      );
    })
    // check that the homepage actually exists and can be reached by a simple GET request

    .then((repos) => {
      // console.log("checking if homepages are valid");
      return Promise.allSettled(
        repos.map((r) => {
          // console.log(
          //   "attempting to get homepage data for " +
          //     r.name +
          //     " at " +
          //     r.homepageUrl
          // );
          return Axios.get(r.homepageUrl)
            .then(({ data }) => {
              // console.log(
              //   "homepage data resolved with\n " + data.substring(0, 100)
              // );
              r.homepage_html = data;
              return r;
            })
            .catch((e) => {
              console.error("homepage data rejected with", e.message);
              r.homepage_html == null;
              return r;
            });
        })
      ).then((resolved) => {
        // console.log("checking that homepage check returned strings");
        return resolved
          .filter(({ status, value }) => {
            console.log(
              // "checking typeof homepage_html === string for repo ",
              value.name
            );
            return typeof value.homepage_html === "string";
          })
          .map((resolved) => resolved.value);
      });
    })

    /*
     * the following META tags are neccessary to provide a rich user experience
     * - keywords
     * - description
     * - og:image
     */
    .then((repos) => {
      console.log("parsing homepage html for needed attributes");
      return repos.map((r) => {
        // console.log("parsing html metadata for project " + r.name);
        const $ = cheerio.load(r.homepage_html);
        r.meta = {
          title: $("title").text(),
          description: $("meta[name='description']").attr("content"),
          keywords: $("meta[name='keywords']").attr("content"),
          portfolioPublic: $("head").attr("data-portfolio-public") || null,
          og: {
            type: $("meta[property='og:type']").attr("content") || null,
            title: $("meta[property='og:title']").attr("content") || null,
            image: $("meta[property='og:image']").attr("content") || null,
            video: {
              url: $("meta[property='og:video']").attr("content") || null,
              secure_url:
                $("meta[property='og:video:secure_url']").attr("content") ||
                null,
              type: $("meta[property='og:video:type']").attr("content") || null,
              width:
                $("meta[property='og:video:width']").attr("content") || null,
              height:
                $("meta[property='og:video:height']").attr("content") || null,
            },
          },
        };
        delete r.homepage_html;
        return r;
      });
    })
    .then((repos) => {
      // only return repositories that have stated that they should be shown on the portfolio
      return repos.filter((r) => r.meta.portfolioPublic === "true");
    })
    // finally send the response
    .then((finalRepos) => {
      console.log("final repo count", finalRepos.length);
      res.json(finalRepos);
    })
    .catch(console.error);
});

module.exports = { path: mountPath, router: projects };
