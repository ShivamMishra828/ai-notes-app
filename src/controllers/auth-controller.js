const { StatusCodes } = require("http-status-codes");
const { AuthService } = require("../services");
const {
    ErrorResponse,
    SuccessResponse,
    Validator,
} = require("../utils/common");
const { ZodError } = require("zod");

async function createUser(req, res) {
    try {
        const userData = await Validator.userSchemaValidator.parseAsync({
            email: req.body.email,
            password: req.body.password,
        });

        const user = await AuthService.createUser(userData);

        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully"));
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => issue.message);
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(new ErrorResponse(error, errorMessages));
        }

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error, error.explanation));
    }
}

module.exports = {
    createUser,
};
