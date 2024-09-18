// Import required modules and configurations
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");

/**
 * Generates a JSON Web Token (JWT) for the given payload
 * @param {object} payload - The data to encode in the token
 * @returns {string} The generated JWT token
 */
function generateJWTToken(payload) {
    // Use the jwt library to sign the payload with the server's secret key
    // and set the token to expire in 1 day
    return jwt.sign(payload, ServerConfig.JWT_SECRET, {
        expiresIn: "1d",
    });
}

// Export the generateJWTToken function for use in other modules
module.exports = generateJWTToken;
