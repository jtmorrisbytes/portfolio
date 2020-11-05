const Redis = require("redis");

const { REDIS_URL } = process.env;
if (!REDIS_URL) {
  throw new TypeError("process.env.REDIS_URL must be defined");
}

const client = Redis.createClient(REDIS_URL);
client.P_GET = (key) => {
  return new Promise((resolve, reject) => {
    client.GET(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
};
client.P_SETEX = (key, seconds, value) => {
  return new Promise((resolve, reject) => {
    client.SETEX(key, seconds, value, (e, reply) => {
      if (e) {
        reject(e);
      } else if (reply === "OK") {
        resolve();
      }
    });
  });
};

module.exports = client;
