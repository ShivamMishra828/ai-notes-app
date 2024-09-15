require("dotenv").config();

module.exports = {
    // Port number for the server
    PORT: process.env.PORT,

    // MongoDB connection url
    MONGODB_URI: process.env.MONGODB_URI,
};
