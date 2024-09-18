const { UserRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const { GenerateVerificationCode, Mailer } = require("../utils/common");
const { VerificationMail } = require("../templates");

const userRepository = new UserRepository();

async function createUser(data) {
    try {
        const existingUser = await userRepository.findOne(data);
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
        throw new AppError(
            "Error creating user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createUser,
};
