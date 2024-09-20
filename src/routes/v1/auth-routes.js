const express = require("express");
const { AuthController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// Creating an Express router for authentication routes
const router = express.Router();

// Sign up route
router.post("/signup", AuthController.createUser);

// Verify Email route
router.post("/verify-email", AuthController.verifyEmail);

// Login route
router.post("/signin", AuthController.loginUser);

// Logout route
router.get("/logout", AuthMiddleware.verifyJwtToken, AuthController.logoutUser);

// Forget Password route
router.post("/forgot-password", AuthController.forgotPassword);

// Reset Password route
router.post("/reset-password/:resetToken", AuthController.resetPassword);

// Export the authentication routes
module.exports = router;
