const octoGraphql = require("../lib/octoGraphql");
async function getSkills(req, res, next) {
  // get all primary languages from first 50 repositories
  if (req.method === "GET") {
    return octoGraphql(
      `query allLanguages {
                viewer {
                    repositories(first:100 privacy:PUBLIC) {
                        nodes {
                            primaryLanguage {
                                name
                            }
                        }
                    }
                }
            }`
    ).then((data) => {
        //   use an object like a set;
      let skills = {}
    //   loop through each iteration and check for null, then assign/overwrite
      data.viewer.repositories.nodes.forEach((node)=>{
          if(node.primaryLanguage==null) {
              return
          }
          skills[node.primaryLanguage.name]=node.primaryLanguage.name
      })
    //   get all
      res.status(200).json(Object.values(skills));
    }).catch(()=>{res.status(500).send(null)});
  }
  next();
}

module.exports = {
  path: "/skills",
  router: getSkills,
};
