const { NoteRepository } = require("../repositories"); // Import NoteRepository for database operations
const AppError = require("../utils/error/app-error"); // Import custom error handler
const { StatusCodes } = require("http-status-codes"); // Import HTTP status codes
const { Gemini } = require("../utils/common"); // Import Gemini utility for AI operations
const { notesIndex } = require("../db/vectordb"); // Import Pinecone vector database index
const mongoose = require("mongoose"); // Import mongoose for MongoDB operations

// Instantiate the NoteRepository for database operations
const noteRepository = new NoteRepository();

// Creates a new note and adds it to the user's notes
async function createNote(data) {
    const session = await mongoose.startSession(); // Start a database session
    session.startTransaction(); // Begin transaction for consistency

    try {
        // Get the embedding for the note content
        const embedding = await getEmbeddingForNote(data); // Generate embedding using Gemini

        // Create the note in the repository
        const note = await noteRepository.create(data, { session }); // Store note in database

        // Upsert the note's embedding into Pinecone
        await notesIndex.upsert([
            {
                id: note._id, // Use note ID for reference
                values: embedding, // Store embedding
                metadata: { userId: data.userId }, // Link to user metadata
            },
        ]);

        // Add the note to the user's notes
        await noteRepository.addNotesToUser(data.userId, note._id, { session }); // Associate note with user

        await session.commitTransaction(); // Commit transaction if successful
        await session.endSession(); // End the session

        return note; // Return the created note
    } catch (error) {
        // Abort the transaction on error
        await session.abortTransaction(); // Rollback transaction
        await session.endSession(); // End the session

        throw new AppError(
            "Error creating note", // Error message for creating note failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

// Fetches a note by its ID
async function fetchNoteById(data) {
    try {
        // Find the note by ID and user ID
        const note = await noteRepository.findOne({
            _id: data.id, // Note ID
            userId: data.userId, // User ID
        });
        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND); // Handle case where note is not found
        }

        return note; // Return the found note
    } catch (error) {
        // Handle errors during fetching a note
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode); // Handle not found error
        }

        throw new AppError(
            "Error fetching note by id", // Error message for fetching note failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

// Fetches all notes for a user
async function fetchAllNotes(data) {
    try {
        // Find all notes for the user
        const notes = await noteRepository.findAll({ userId: data.userId });
        return notes; // Return all found notes
    } catch (error) {
        throw new AppError(
            "Error fetching all notes", // Error message for fetching notes failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

// Updates an existing note
async function updateNote(data) {
    const session = await mongoose.startSession(); // Start a database session
    session.startTransaction(); // Begin transaction

    try {
        // Find the note by ID and user ID
        const note = await noteRepository.findOne({
            _id: data.noteId, // Note ID
            userId: data.userId, // User ID
        });

        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND); // Handle case where note is not found
        }

        // Generate the new embedding for the updated note content
        const embedding = await getEmbeddingForNote(data); // Generate updated embedding using Gemini

        // Update the note in the repository
        const updatedNote = await noteRepository.update(
            note._id, // ID of the note to update
            { ...data }, // New note data
            { session } // Pass session for transaction
        );

        // Upsert the new embedding into Pinecone
        await notesIndex.upsert([
            {
                id: note._id, // Use note ID for reference
                values: embedding, // Store updated embedding
                metadata: { userId: data.userId }, // Link to user metadata
            },
        ]);

        await session.commitTransaction(); // Commit transaction if successful
        await session.endSession(); // End the session

        return updatedNote; // Return updated note
    } catch (error) {
        await session.abortTransaction(); // Rollback transaction on error
        await session.endSession(); // End the session

        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode); // Handle not found error
        }

        throw new AppError(
            "Error updating note", // Error message for updating note failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

// Deletes a note and its embedding from the vector database
async function deleteNote(data) {
    // Start a database session
    const session = await mongoose.startSession(); // Start a session
    // Begin transaction
    session.startTransaction(); // Begin transaction

    try {
        // Find the note by ID and user ID
        const note = await noteRepository.findOne({
            _id: data.id, // Note ID
            userId: data.userId, // User ID
        });
        // Handle case where note is not found
        if (!note) {
            throw new AppError("Note not found", StatusCodes.NOT_FOUND); // Handle not found error
        }

        // Remove note from user's note list
        await noteRepository.removeNotesToUser(data.userId, data.id); // Remove association with user
        // Delete note from the database
        const response = await noteRepository.delete(note._id); // Delete note from database

        // Delete note's embedding from Pinecone vector database
        await notesIndex.deleteOne(note._id); // Remove embedding from vector database

        // Commit transaction if successful
        await session.commitTransaction(); // Commit transaction
        // End the session
        await session.endSession(); // End the session

        // Return the delete response
        return response; // Return delete response
    } catch (error) {
        await session.abortTransaction(); // Rollback transaction on error
        await session.endSession(); // End the session

        // Handle not found error
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode); // Handle not found error
        }

        throw new AppError(
            "Error deleting note", // Error message for deleting note failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

// Helper function to get embedding for a note based on its title and content
async function getEmbeddingForNote(data) {
    // Calls the Gemini AI service to generate an embedding based on note's content
    return Gemini.getEmbedding(data.title + "\n\n" + data.content ?? ""); // Generate embedding
}

// Chat route to respond to user queries
async function chatRoute(data) {
    try {
        // Get embedding for the user's query
        const messageEmbedding = await getEmbeddingForNote({
            title: "Query", // Title for embedding
            content: data.message, // User's message
        });

        // Search for relevant notes using the embedding
        const searchResult = await notesIndex.query({
            topK: 1, // Get the top match
            vector: messageEmbedding, // Query vector
            filter: { userId: data.userId }, // Filter by user ID
        });

        // Handle case where no relevant notes are found
        if (!searchResult.matches.length) {
            throw new AppError(
                "No relevant notes found", // Error message for no matches
                StatusCodes.NOT_FOUND // Not found status
            );
        }

        const bestMatch = searchResult.matches[0]; // Get the best match
        const noteId = bestMatch.id; // Extract note ID

        // Find the matching note in the repository
        const note = await noteRepository.findOne({
            _id: noteId, // Note ID
            userId: data.userId, // User ID
        });

        // Handle case where matching note is not found
        if (!note) {
            throw new AppError(
                "Matching note not found in the database", // Error message for missing note
                StatusCodes.NOT_FOUND // Not found status
            );
        }

        // Create a prompt for the AI based on the note's content
        const prompt = `You are an assistant helping the user retrieve information from their notes. The user's note is titled "${note.title}" and contains the following information: "${note.content}". The user asked: "${data.message}". Provide a friendly and detailed response based on this information.`;

        // Generate a response using Gemini AI
        const aiResponse = await Gemini.model.generateContent(prompt); // Generate AI response

        // Handle case where AI fails to generate a response
        if (!aiResponse.response) {
            throw new AppError(
                "Ai failed to generate a response", // Error message for AI failure
                StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
            );
        }

        return aiResponse.response.text(); // Return AI response text
    } catch (error) {
        // Handle not found error
        if (error.statusCode === StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode); // Handle not found error
        }

        throw new AppError(
            "Error in chat route", // Error message for chat route failure
            StatusCodes.INTERNAL_SERVER_ERROR // Internal server error status
        );
    }
}

module.exports = {
    createNote,
    fetchNoteById,
    fetchAllNotes,
    updateNote,
    deleteNote,
    chatRoute,
};
