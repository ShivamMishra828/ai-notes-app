const { z } = require("zod");
const { WORK, PERSONAL, IDEAS } = require("../../constants").CATEGORY_OPTIONS;
const mongoose = require("mongoose");

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

const forgetPasswordValidation = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, { message: "Email is required" }),
});

const resetPasswordValidation = z.object({
    newPassword: z
        .string()
        .min(8, { message: "New Password must be at least 8 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            }
        ),
    confirmNewPassword: z
        .string()
        .min(8, {
            message: "Confirm New Password must be at least 8 characters",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Confirm New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            }
        ),
    resetToken: z.string().min(1, { message: "Reset Token is required" }),
});

const noteSchemaValidator = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Title is required" })
        .max(100, { message: "Title must be at most 100 characters" }),
    content: z.string().min(1, { message: "Content is required" }),
    userId: z
        .string()
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
            message: "Invalid ObjectId",
        }),
    category: z
        .string()
        .optional()
        .refine((value) => [WORK, PERSONAL, IDEAS].includes(value), {
            message: "Invalid category",
        }),
});

module.exports = {
    userSchemaValidator,
    verifyUserValidation,
    forgetPasswordValidation,
    resetPasswordValidation,
    noteSchemaValidator,
};
