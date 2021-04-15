const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
module.exports = {
  connect: open({
    filename: path.join(process.cwd(), "session.db"),
    driver:sqlite3.Database
  }).then((db)=>{
      return db.get("SELECT * from session").then(()=>{
          db.findAll = function() {
              return db.all("SELECT * from session")
          }
        return db
        }).catch((e)=>{
          if((e.message || "").includes("no such table")) {
              db.exec(`CREATE TABLE IF NOT EXISTS session (
                id TEXT NOT NULL,
                ip_addr TEXT NOT NULL,
                token TEXT NOT NULL,
                created INT NOT NULL
            )`)
          }
      })
  }),
};
