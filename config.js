const path = require("path"); 

var config = {
    IMAGE_UPLOAD_PATH : path.join(__dirname, "uploads/"),
    DB_PATH : path.join(__dirname, "db/")
};

module.exports = config;