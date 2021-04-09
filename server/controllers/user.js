// the user endpoint
const user = require("express").Router();

const redis = require("../lib/redis");
const { P_SETEX } = require("../lib/redis");
// 60 seconds times 30 minutes
const USER_CACHE_SECONDS = 60 * 30;

const octoGraphql = require("../lib/octoGraphql");

user.get("/",  (req, res) => {
  octoGraphql(`query { 
    viewer { 
      login,
      name,
      url,
      avatarUrl,
      bio,
      company,
      email,
      isHireable
    }}`)
    .then((response)=>{
      res.json(response.viewer)
    })
    .catch((e)=>{
      console.error(e);
      res.sendStatus(500)
    })
});

module.exports = {
  path: "/user",
  router: user,
};
