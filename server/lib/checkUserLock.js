const redis = require("./redis");
module.exports = function checkUserLock() {
  return new Promise((resolve, reject) => {
    // console.log("getting user lock state");
    redis.P_GET("user.lock").then((reply) => {
      // console.log("got reply from redis", reply);
      if (reply == "false" || reply == null) {
        // console.log("user is not locked");
        resolve();
      } else {
        // wait for the lock to be released
        console.log("using polling to wait for the lock to be cleared");
        let intervalId = setInterval(() => {
          console.log("Polling user.lock");
          redis.GET("user.lock", (err, reply) => {
            if (err) {
              console.log("polling error", err);
              reject(err);
            } else {
              console.log("polling reply", reply, typeof reply);
              if (reply == null || reply == "false") {
                clearInterval(intervalId);
                resolve();
              }
            }
          });
        }, 1000);
      }
    });
  });
};
