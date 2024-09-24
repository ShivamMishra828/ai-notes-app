const { NoteRepository } = require("../repositories");
const AppError = require("../utils/error/app-error");
const { StatusCodes } = require("http-status-codes");
const { Gemini } = require("../utils/common");
const { notesIndex } = require("../db/vectordb");
const mongoose = require("mongoose");

const noteRepository = new NoteRepository();

async function createNote(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const embedding = await getEmbeddingForNote(data);

        const note = await noteRepository.create(data, { session });

        await notesIndex.upsert([
            {
                id: note._id,
                values: embedding,
                metadata: { userId: data.userId },
            },
        ]);

        await noteRepository.addNotesToUser(data.userId, note._id, { session });

        await session.commitTransaction();
        await session.endSession();

        return note;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

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

async function updateNote(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const note = await noteRepository.findOne({
            _id: data.noteId,
            userId: data.userId,
        });

        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND);
        }

        // Generate the new embedding for the updated note content
        const embedding = await getEmbeddingForNote(data);

        // Update the note in the repository
        const updatedNote = await noteRepository.update(
            note._id,
            { ...data },
            { session }
        );

        // Upsert the new embedding into Pinecone
        await notesIndex.upsert([
            {
                id: note._id,
                values: embedding,
                metadata: { userId: data.userId },
            },
        ]);

        await session.commitTransaction();
        await session.endSession();

        return updatedNote;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error updating note",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function deleteNote(data) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const note = await noteRepository.findOne({
            _id: data.id,
            userId: data.userId,
        });
        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND);
        }
        await noteRepository.removeNotesToUser(data.userId, data.id);
        const response = await noteRepository.delete(note._id);

        await notesIndex.deleteOne(note._id);

        await session.commitTransaction();
        await session.endSession();

        return response;
    } catch (error) {
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "Error deleting note",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function getEmbeddingForNote(data) {
    return Gemini.getEmbedding(data.title + "\n\n" + data.content ?? "");
}

module.exports = {
    createNote,
    fetchNoteById,
    fetchAllNotes,
    updateNote,
    deleteNote,
};
