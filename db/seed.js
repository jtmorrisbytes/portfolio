// seed.js: a small script to run the seed.sql file

require("dotenv").config();
const massive = require("massive");
const { DATABASE_URL, NODE_ENV } = process.env;

if (DATABASE_URL == null) {
  throw new TypeError("process.env.DATABASE_URL must be provided");
}
console.log("Connecting to database...");
massive({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: NODE_ENV === "production" },
})
  .then((db) => {
    console.log("Connected. Begin seed...");
    return db.seed().then((response) => {
      console.log("Success!");
    });
  })
  .catch((e) => {
    console.error("Seed failed!");
    console.error(e);
  });
