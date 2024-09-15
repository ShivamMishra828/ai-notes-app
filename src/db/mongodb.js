const mongoose = require("mongoose");
const { ServerConfig } = require("../config");

// Defining a function to connect to the MongoDB database
async function connectToDB() {
    // Establish a connection to the MongoDB instance using Mongoose
    const connectionInstance = await mongoose.connect(ServerConfig.MONGODB_URI);

    // Log a success message with the MongoDB host
    console.log(
        `MongoDB Connected Successfully !! Host:- ${connectionInstance.connection.host}`
    );
}

// Export the connectToDB function as a module
module.exports = { connectToDB };
