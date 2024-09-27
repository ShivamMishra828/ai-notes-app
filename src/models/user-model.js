const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defining the schema for a User
const userSchema = new mongoose.Schema(
    {
        // The email address of the user, required, unique, indexed, and trimmed
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        // The hashed password of the user, required and trimmed
        password: {
            type: String,
            required: true,
            trim: true,
            select: false, // Excludes password field when querying user data
        },
        // Whether the user has verified their email address
        isVerified: {
            type: Boolean,
            default: false,
        },
        // The timestamp of the user's last login
        lastLogin: {
            type: Date,
            default: null,
        },
        // References to the notes created by the user
        notes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note",
            },
        ],
        // Token and expiration time for resetting the user's password
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        // Code and expiration time for email verification
        verificationCode: String,
        verificationCodeExpiresAt: Date,
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", function (next) {
    // Only hash the password if it has been modified
    if (!this.isModified("password")) return next();

    // Hash the password with a salt factor of 10
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

// Method to check if the provided password matches the hashed password
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Creating the User model based on the schema
const User = mongoose.model("User", userSchema);

// Exporting the User model
module.exports = User;
