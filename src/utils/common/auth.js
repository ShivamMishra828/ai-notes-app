const AppError = require("../error/app-error");
const { ServerConfig } = require("../../config");
const jwt = require("jsonwebtoken");

/**
 * Decodes a JSON Web Token (JWT) and returns the payload
 * @param {string} token - The JWT to decode
 * @returns {Promise<object>} The decoded payload
 */
async function decodeToken(token) {
    try {
        // Use the jwt library to decode the token with the server's secret key
        return await jwt.verify(token, ServerConfig.JWT_SECRET);
    } catch (error) {
        // If decoding fails, throw an AppError with a suitable message and status code
        throw new AppError(
            "Failed to decode token",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Export the decodeToken function for use in other modules
module.exports = { decodeToken };
