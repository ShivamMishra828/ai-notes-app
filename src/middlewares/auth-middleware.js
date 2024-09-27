const { ErrorResponse, Auth } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/error/app-error");

// Middleware to verify the JWT token for authentication
async function verifyJwtToken(req, res, next) {
    try {
        // Extract the token from cookies or Authorization header
        const token =
            req.cookies.token || req.headers["Authorization"]?.split(" ")[1];

        // If token is not found, return an unauthorized response
        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Token not found. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Decode the token and verify its validity
        const decodedData = await Auth.decodeToken(token);
        if (!decodedData || !decodedData.id) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Invalid JWT token. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Set the userId from decoded data in the request object
        req.userId = decodedData.id;
        next();
    } catch (error) {
        // Handle errors during token verification and return the appropriate response
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    error,
                    error.explanation ||
                        "Something went wrong while verifying the JWT token"
                )
            );
    }
}

// Exporting the verifyJwtToken middleware
module.exports = {
    verifyJwtToken,
};
