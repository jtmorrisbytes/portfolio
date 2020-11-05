// octoclient: a small library to get the PAT from process.env

const { GITHUB_AUTH_TOKEN } = process.env;

if (!GITHUB_AUTH_TOKEN) {
  throw new TypeError(
    "You must provide 'GITHUB_AUTH_TOKEN' in Environment Variables for this module to work correctly"
  );
}

const { Octokit } = require("@octokit/rest");
const Bottleneck = require("bottleneck");
const client = require("./redis.js");

const connection = new Bottleneck.RedisConnection({
  maxConcurrent: 5,
  client,
});
connection.on("error", console.error);

process.on("beforeExit", async () => {
  await connection.disconnect();
});
module.exports = new Octokit({
  auth: GITHUB_AUTH_TOKEN,

  onRateLimit: () => true,
  onAbuseLimit: () => false,
  connection,
  id: "jtmorrisbytes-portfolio",
});
