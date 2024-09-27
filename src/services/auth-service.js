const { UserRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const {
    GenerateVerificationCode,
    Mailer,
    GenerateJWTToken,
} = require("../utils/common");
const { VerificationMail, SuccessMail, ResetMail } = require("../templates");
const uuid = require("uuid").v4;
const { ServerConfig } = require("../config");

// Instantiate the UserRepository for database operations
const userRepository = new UserRepository();

// Creates a new user with verification process
async function createUser(data) {
    try {
        // Check if the user already exists
        const existingUser = await userRepository.findOne({
            email: data.email,
        });
        if (existingUser) {
            throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
        }

        // Generate a verification code (OTP)
        const generatedOtp = GenerateVerificationCode.generate();

        // Send the verification mail
        const response = await Mailer.sendMail({
            receiverInfo: data.email,
            subject: "Verification Mail",
            body: VerificationMail(generatedOtp),
        });

        // Check if the email was sent successfully
        if (!response) {
            throw new AppError(
                "Can't send verification mail",
                StatusCodes.BAD_REQUEST
            );
        }

        // Create the new user
        const user = await userRepository.create({
            email: data.email,
            password: data.password,
            verificationCode: generatedOtp,
            verificationCodeExpiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        return user;
    } catch (error) {
        // Handle errors during user creation
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error creating user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Verifies the user's email with the provided OTP
async function verifyEmail(data) {
    try {
        const user = await userRepository.findOne({ email: data.email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        // Check if the user is already verified
        if (user.isVerified === true) {
            throw new AppError(
                "User is already verified",
                StatusCodes.BAD_REQUEST
            );
        }

        // Validate the provided OTP
        if (data.otp != user.verificationCode) {
            throw new AppError("Invalid otp", StatusCodes.BAD_REQUEST);
        }

        // Check if the OTP has expired
        if (user.verificationCodeExpiresAt <= Date.now()) {
            throw new AppError("Otp expires", StatusCodes.BAD_REQUEST);
        }

        const payload = { id: user._id };
        const jwtToken = GenerateJWTToken(payload);

        // Update user's verification status and last login time
        user.lastLogin = Date.now();
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;

        await user.save();

        // Send a welcome email
        const response = await Mailer.sendMail({
            receiverInfo: data.email,
            subject:
                "Welcome Aboard! Your Account Has Been Successfully Created",
            body: SuccessMail(),
        });
        if (!response) {
            throw new AppError(
                "Can't send welcome mail",
                StatusCodes.BAD_REQUEST
            );
        }

        return { user, jwtToken };
    } catch (error) {
        // Handle errors during email verification
        if (
            error.statusCode === StatusCodes.BAD_REQUEST ||
            error.statusCode === StatusCodes.NOT_FOUND
        ) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Verifying User Email",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Logs in the user and generates a JWT token
async function loginUser(data) {
    try {
        const user = await userRepository.getUserWithPassword(data.email);
        if (!user) {
            throw new AppError(
                "User not exists, signup first",
                StatusCodes.NOT_FOUND
            );
        }

        // Validate the provided password
        const isPasswordCorrect = await user.checkPassword(data.password);
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        const payload = { id: user._id };
        const jwtToken = GenerateJWTToken(payload);

        // Update user's last login time
        user.lastLogin = Date.now();
        await user.save();

        return { user, jwtToken };
    } catch (error) {
        // Handle errors during user login
        if (
            error.statusCode === StatusCodes.BAD_REQUEST ||
            error.statusCode === StatusCodes.NOT_FOUND
        ) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Error Logging in user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Initiates the password reset process
async function forgotPassword(data) {
    try {
        const user = await userRepository.findOne({ email: data.email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        // Generate a reset token and set its expiration time
        const resetToken = uuid();
        const resetURL = `${ServerConfig.CLIENT_URL}/reset-password/${resetToken}`;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send the reset password email
        const response = await Mailer.sendMail({
            receiverInfo: data.email,
            subject: "Reset Your Password",
            body: ResetMail.resetPasswordTemplate(resetURL),
        });
        if (!response) {
            throw new AppError(
                "Can't send reset password mail",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        // Handle errors during the password reset process
        if (
            error.statusCode === StatusCodes.BAD_REQUEST ||
            error.statusCode === StatusCodes.NOT_FOUND
        ) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Something went wrong while forgotting the password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Resets the user's password with the new one
async function resetPassword(data) {
    try {
        // Check if new password matches confirmation
        if (data.newPassword !== data.confirmNewPassword) {
            throw new AppError(
                "New Password and Confirm new password must be the same",
                StatusCodes.BAD_REQUEST
            );
        }

        // Find the user with the reset token
        const user = await userRepository.findOne({
            resetPasswordToken: data.resetToken,
            resetPasswordExpiresAt: { $gt: Date.now() }, // Check if token is still valid
        });
        if (!user) {
            throw new AppError(
                "Invalid or expired reset token",
                StatusCodes.BAD_REQUEST
            );
        }

        // Update the user's password and clear the reset token
        user.password = data.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        // Send a success email after resetting the password
        const response = await Mailer.sendMail({
            receiverInfo: user.email,
            subject: "Password Reset Successfully",
            body: ResetMail.resetPasswordSuccessTemplate(),
        });
        if (!response) {
            throw new AppError(
                "Can't send reset password success mail",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        // Handle errors during password reset
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "Something went wrong while resetting user password",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

// Exporting the authentication service functions for use in other modules
module.exports = {
    createUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
};
