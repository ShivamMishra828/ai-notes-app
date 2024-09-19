const { UserRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const {
    GenerateVerificationCode,
    Mailer,
    GenerateJWTToken,
} = require("../utils/common");
const { VerificationMail, SuccessMail } = require("../templates");

const userRepository = new UserRepository();

async function createUser(data) {
    try {
        const existingUser = await userRepository.findOne({
            email: data.email,
        });
        if (existingUser) {
            throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
        }

        const generatedOtp = GenerateVerificationCode.generate();

        const response = await Mailer.sendMail({
            receiverInfo: data.email,
            subject: "Verification Mail",
            body: VerificationMail(generatedOtp),
        });

        if (!response) {
            throw new AppError(
                "Can't send verification mail",
                StatusCodes.BAD_REQUEST
            );
        }

        const user = await userRepository.create({
            email: data.email,
            password: data.password,
            verificationCode: generatedOtp,
            verificationCodeExpiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        return user;
    } catch (error) {
        console.log(error);
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error creating user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function verifyEmail(data) {
    try {
        const user = await userRepository.findOne({ email: data.email });
        if (!user) {
            throw new AppError("User not found", StatusCodes.NOT_FOUND);
        }

        if (user.isVerified === true) {
            throw new AppError(
                "User is already verified",
                StatusCodes.BAD_REQUEST
            );
        }

        if (data.otp != user.verificationCode) {
            throw new AppError("Invalid otp", StatusCodes.BAD_REQUEST);
        }

        if (user.verificationCodeExpiresAt <= Date.now()) {
            throw new AppError("Otp expires", StatusCodes.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
        };
        const jwtToken = GenerateJWTToken(payload);

        user.lastLogin = Date.now();
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpiresAt = undefined;

        await user.save();

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
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error Verifying User Email",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function loginUser(data) {
    try {
        const user = await userRepository.getUserWithPassword(data.email);
        if (!user) {
            throw new AppError(
                "User not exists, signup first",
                StatusCodes.NOT_FOUND
            );
        }

        const isPasswordCorrect = await user.checkPassword(data.password);
        if (!isPasswordCorrect) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
        };
        const jwtToken = GenerateJWTToken(payload);

        user.lastLogin = Date.now();
        await user.save();

        return { user, jwtToken };
    } catch (error) {
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error Logging in user",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createUser,
    verifyEmail,
    loginUser,
};
