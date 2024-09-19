const express = require("express");
const { AuthController } = require("../../controllers");

// Creating an Express router for authentication routes
const router = express.Router();

// Sign up route
router.post("/signup", AuthController.createUser);

// Verify Email route
router.post("/verify-email", AuthController.verifyEmail);

// Login route
router.post("/signin", AuthController.loginUser);

// Export the authentication routes
module.exports = router;
