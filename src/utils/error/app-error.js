// Define a custom AppError class that extends the built-in Error class
class AppError extends Error {
    /**
     * Constructor function to initialize the error object
     * @param {string} message - The error message
     * @param {number} statusCode - The HTTP status code for the error
     */
    constructor(message, statusCode) {
        // Call the parent class constructor with the error message
        super(message);

        // Set the HTTP status code for the error
        this.statusCode = statusCode;

        // Set a detailed explanation of the error (same as the message)
        this.explanation = message;
    }
}

// Export the AppError class for use in other modules
module.exports = AppError;
