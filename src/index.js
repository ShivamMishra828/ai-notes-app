const app = require("./app");
const { MONGODB } = require("./db");
const { ServerConfig } = require("./config");

// Getting the port number from the server configuration
const PORT = ServerConfig.PORT;

// Connecting to the database and starting the server
MONGODB.connectToDB()
    .then(() => {
        // If database connection is successful, start the server
        app.listen(PORT, () => {
            console.log(`Server Started at PORT:- ${PORT}`);
        });
    })
    .catch((error) => {
        // If database connection fails, log error and exit the process
        console.log(`MongoDB Connection Failed !! Error:- ${error}`);
        process.exit(1); // Exit with non-zero status code
    });
