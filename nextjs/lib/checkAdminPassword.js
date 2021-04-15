const bcrypt = require("bcrypt");
module.exports = function checkAdminPassword(hash){
    try {
        return bcrypt.compareSync(hash,process.env.HASHED_PASSWORD)
    }
    catch (e) {
        console.error(e);
        return false;
    }
}