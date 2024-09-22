const { NoteRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");

const noteRepository = new NoteRepository();

async function createNote(data) {
    try {
        const note = await noteRepository.create(data);
        return note;
    } catch (error) {
        throw new AppError(
            "Error creating note",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchNoteById(data) {
    try {
        const note = await noteRepository.findOne({
            _id: data.id,
            userId: data.userId,
        });
        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND);
        }

        return note;
    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error fetching note by id",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchAllNotes(data) {
    try {
        const notes = await noteRepository.findAll({ userId: data.userId });
        return notes;
    } catch (error) {
        throw new AppError(
            "Error fetching all notes",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createNote,
    fetchNoteById,
    fetchAllNotes,
};
