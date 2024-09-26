const express = require("express");
const { NoteController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// Creating an Express router for authentication routes
const router = express.Router();

// Use Verify JWT Middleware
router.use(AuthMiddleware.verifyJwtToken);

// Create Note route
router.post("/", NoteController.createNote);

// Fetch Note By Id route
router.get("/:noteId", NoteController.fetchNoteById);

// Fetch All Notes route
router.get("/", NoteController.fetchAllNotes);

// Update Note route
router.patch("/:noteId", NoteController.updateNote);

// Delete Note route
router.delete("/:noteId", NoteController.deleteNote);

// Chat route
router.post("/chat", NoteController.chatRoute);

// Export the authentication routes
module.exports = router;
