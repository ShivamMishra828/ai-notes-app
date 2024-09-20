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

async function loginUser(req, res) {
    try {
        const userData = await Validator.userSchemaValidator.parseAsync({
            email: req.body.email,
            password: req.body.password,
        });

        const { user, jwtToken } = await AuthService.loginUser(userData);

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

async function logoutUser(req, res) {
    try {
        return res
            .clearCookie("token")
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully"));
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    error,
                    "Something went wrong while logging out the user"
                )
            );
    }
}

async function forgotPassword(req, res) {
    try {
        const data = await Validator.forgetPasswordValidation.parseAsync({
            email: req.body.email,
        });

        await AuthService.forgotPassword(data);

        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    {},
                    "Reset Password link has been sent to your email"
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

async function resetPassword(req, res) {
    try {
        const data = await Validator.resetPasswordValidation.parseAsync({
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
            resetToken: req.params.resetToken,
        });

        await AuthService.resetPassword(data);

        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "Password Reset Successfully"));
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
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
};
