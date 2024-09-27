const { StatusCodes } = require("http-status-codes");
const { NoteService } = require("../services");
const {
    ErrorResponse,
    SuccessResponse,
    Validator,
} = require("../utils/common");
const { ZodError } = require("zod");

// Controller function to create a new note
async function createNote(req, res) {
    try {
        // Validate incoming note data
        const data = await Validator.noteSchemaValidator.parseAsync({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            userId: req.userId,
        });

        // Call service to create the note
        const note = await NoteService.createNote(data);

        // Return success response
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(note, "Note created successfully"));
    } catch (error) {
        // Handle validation errors
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to fetch a note by its ID
async function fetchNoteById(req, res) {
    try {
        // Call service to fetch note by its ID
        const note = await NoteService.fetchNoteById({
            id: req.params.noteId,
            userId: req.userId,
        });

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(note, "Successfully fetched note by id"));
    } catch (error) {
        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to fetch all notes for a user
async function fetchAllNotes(req, res) {
    try {
        // Call service to fetch all notes for the user
        const notes = await NoteService.fetchAllNotes({
            userId: req.userId,
        });

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(notes, "Notes fetched successfully"));
    } catch (error) {
        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to update an existing note
async function updateNote(req, res) {
    try {
        // Call service to update the note with the new data
        const note = await NoteService.updateNote({
            ...req.body,
            userId: req.userId,
            noteId: req.params.noteId,
        });

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(note, "Note updated successfully"));
    } catch (error) {
        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to delete a note
async function deleteNote(req, res) {
    try {
        // Call service to delete the note by its ID
        const response = await NoteService.deleteNote({
            id: req.params.noteId,
            userId: req.userId,
        });

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(response, "Note deleted successfully"));
    } catch (error) {
        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

// Controller function to handle user queries via chatbot (using AI)
async function chatRoute(req, res) {
    try {
        // Call service to process the user query and generate AI response
        const response = await NoteService.chatRoute({
            message: req.body.message,
            userId: req.userId,
        });

        // Return success response
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(response, "Response generated"));
    } catch (error) {
        // Handle server errors
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
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
