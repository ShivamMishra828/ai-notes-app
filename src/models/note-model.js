const mongoose = require("mongoose");
const { IDEAS, PERSONAL, WORK } = require("../constants").CATEGORY_OPTIONS;

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            enum: [WORK, PERSONAL, IDEAS],
        },
    },
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
