const { ErrorResponse, Auth } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/error/app-error");

async function verifyJwtToken(req, res, next) {
    try {
        const token =
            req.cookies.token || req.headers["Authorization"]?.split(" ")[1];
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

        req.userId = decodedData.id;
        next();
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    error,
                    error.explanation ||
                        "Something went wrong while verifying the jwt token"
                )
            );
    }
}

module.exports = {
    verifyJwtToken,
};
