const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services");
const {
    ErrorResponse,
    SuccessResponse,
    Validator,
} = require("../utils/common");
const { ZodError } = require("zod");

// Controller function to create a new user
async function createUser(req, res) {
    try {
        // Validate incoming user data using the schema
        const userData = await Validator.userSchemaValidator.parseAsync({
            email: req.body.email,
            password: req.body.password,
        });

        // Call service to create a new user
        const user = await AuthService.createUser(userData);

        // Return success response
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully"));
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to verify a user's email via OTP
async function verifyEmail(req, res) {
    try {
        // Validate incoming OTP and email
        const data = await Validator.verifyUserValidation.parseAsync({
            email: req.body.email,
            otp: req.body.otp,
        });

        // Call service to verify email and generate JWT
        const { user, jwtToken } = await AuthService.verifyEmail(data);

        // Set cookie with JWT and return success response
        return res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { user, token: jwtToken },
                    "User verified successfully"
                )
            );
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to log in a user
async function loginUser(req, res) {
    try {
        // Validate incoming login data
        const userData = await Validator.userSchemaValidator.parseAsync({
            email: req.body.email,
            password: req.body.password,
        });

        // Call service to log in the user and generate JWT
        const { user, jwtToken } = await AuthService.loginUser(userData);

        // Set cookie with JWT and return success response
        return res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { user, token: jwtToken },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to log out a user
async function logoutUser(req, res) {
    try {
        // Clear the JWT cookie and return success response
        return res
            .clearCookie("token")
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully"));
    } catch (error) {
        // Handle server errors
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

// Controller function to initiate forgot password process
async function forgotPassword(req, res) {
    try {
        // Validate incoming email for password reset
        const data = await Validator.forgetPasswordValidation.parseAsync({
            email: req.body.email,
        });

        // Call service to handle forgot password logic
        await AuthService.forgotPassword(data);

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    {},
                    "Reset Password link has been sent to your email"
                )
            );
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to reset a user's password
async function resetPassword(req, res) {
    try {
        // Validate incoming new password and reset token
        const data = await Validator.resetPasswordValidation.parseAsync({
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
            resetToken: req.params.resetToken,
        });

        // Call service to reset password
        await AuthService.resetPassword(data);

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "Password reset successfully"));
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
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
