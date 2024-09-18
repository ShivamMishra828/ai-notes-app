const { z } = require("zod");

const userSchemaValidator = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, { message: "Email is required" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            }
        ),
});

const verifyUserValidation = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, { message: "Email is required" }),
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^[0-9]+$/, "OTP must contain only numbers"),
});

module.exports = {
    userSchemaValidator,
    verifyUserValidation,
};
