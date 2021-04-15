const session = require("../../../lib/session")

module.exports = async function authorize(req,res) {
    if(typeof req.query?.password != "string" ) {
        res.status(400).send("Missing password in request")
    }
    let db = await session.connect;
    res.send("OK")
}