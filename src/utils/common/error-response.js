/**
 * Class representing an error response
 */
class ErrorResponse {
    /**
     * Constructor to initialize the error response object
     * @param {Error} error - The error object
     * @param {string} [message="Something went wrong"] - The error message
     */
    constructor(error, message = "Something went wrong") {
        // Set the success flag to false to indicate an error
        this.success = false;

        // Set the error message
        this.message = message;

        // Initialize an empty data object
        this.data = {};

        // Store the error object
        this.error = error;
    }
}

// Export the ErrorResponse class for use in other modules
module.exports = ErrorResponse;
