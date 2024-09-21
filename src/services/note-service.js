const { NoteRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");

const noteRepository = new NoteRepository();

async function createNote(data) {
    try {
        const note = await noteRepository.create(data);
        return note;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "Error creating note",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createNote,
};
