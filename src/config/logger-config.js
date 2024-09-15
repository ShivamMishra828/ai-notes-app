const fs = require("fs");
const morgan = require("morgan");
const { LOG_FILE_PATH } = require("../constants");

// Creating a write stream for the log file
const accessLogStream = fs.createWriteStream(LOG_FILE_PATH, { flags: "a" });

// Defining a custom log format for morgan
morgan.format(
    "myFormat",
    "[:date[web]] ':method :url' :status :response-time ms ':user-agent'"
);

// Creating a logger instance with the custom format and log stream
const logger = morgan("myFormat", { stream: accessLogStream });

// Exporting the logger instance
module.exports = {
    logger,
};
