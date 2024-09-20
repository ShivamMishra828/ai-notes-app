const path = require("path");

// Path to the log file
const LOG_FILE_PATH = path.join(__dirname, "server.log");

const CATEGORY_OPTIONS = {
    WORK: "work",
    PERSONAL: "personal",
    IDEAS: "ideas",
};

module.exports = {
    LOG_FILE_PATH,
    CATEGORY_OPTIONS,
};
