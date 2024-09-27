const mongoose = require("mongoose");
const { IDEAS, PERSONAL, WORK } = require("../constants").CATEGORY_OPTIONS;

// Defining the schema for a Note
const noteSchema = new mongoose.Schema(
    {
        // The title of the note, required and trimmed
        title: {
            type: String,
            required: true,
            trim: true,
        },
        // The content of the note, required
        content: {
            type: String,
            required: true,
        },
        // Reference to the User who owns the note, required
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // The category of the note (Work, Personal, or Ideas)
        category: {
            type: String,
            enum: [WORK, PERSONAL, IDEAS],
        },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Creating the Note model based on the schema
const Note = mongoose.model("Note", noteSchema);

// Exporting the Note model
module.exports = Note;
