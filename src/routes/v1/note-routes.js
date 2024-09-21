const express = require("express");
const { NoteController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// Creating an Express router for authentication routes
const router = express.Router();

// Use Verify JWT Middleware
router.use(AuthMiddleware.verifyJwtToken);

// Create Note route
router.post("/", NoteController.createNote);

// Export the authentication routes
module.exports = router;
