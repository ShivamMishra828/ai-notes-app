const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services");
const {
    ErrorResponse,
    SuccessResponse,
    Validator,
} = require("../utils/common");
const { ZodError } = require("zod");

async function createUser(req, res) {
    try {
        const userData = await Validator.userSchemaValidator.parseAsync({
            email: req.body.email,
            password: req.body.password,
        });

        const user = await AuthService.createUser(userData);

        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully"));
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

async function verifyEmail(req, res) {
    try {
        const data = await Validator.verifyUserValidation.parseAsync({
            email: req.body.email,
            otp: req.body.otp,
        });

        const { user, jwtToken } = await AuthService.verifyEmail(data);

        return res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { user, token: jwtToken },
                    "User verified successfully"
                )
            );
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

module.exports = {
    createUser,
    verifyEmail,
};
