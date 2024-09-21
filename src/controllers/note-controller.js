const { StatusCodes } = require("http-status-codes");
const { NoteService } = require("../services");
const {
    ErrorResponse,
    SuccessResponse,
    Validator,
} = require("../utils/common");
const { ZodError } = require("zod");

async function createNote(req, res) {
    try {
        const data = await Validator.noteSchemaValidator.parseAsync({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            userId: req.userId,
        });

        const note = await NoteService.createNote(data);
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(note, "Note created successfully"));
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

module.exports = {
    createNote,
};
