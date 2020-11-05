// the user endpoint
const user = require("express").Router();

const redis = require("../lib/redis");
const { P_SETEX } = require("../lib/redis");
// 60 seconds times 30 minutes
const USER_CACHE_SECONDS = 60 * 30;

const octoClient = require("../lib/octoclient");

user.get("/", (req, res) => {
  let u = req.user;
  res.json({
    login: u.login,
    id: u.id,
    avatar_url: u.avatar_url,
    html_url: u.html_url,
    name: u.name,
    company: u.company,
    blog: u.blog,
    email: u.email,
    location: u.location,
    followers: u.followers,
    twitter_username: u.twitter_username,
  });
});

module.exports = {
  path: "/user",
  router: user,
};
