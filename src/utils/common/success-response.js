/**
 * Class representing a successful response
 */
class SuccessResponse {
    /**
     * Constructor to initialize the success response object
     * @param {object} data - The response data
     * @param {string} [message="Successfully completed the request"] - The response message
     */
    constructor(data, message = "Successfully completed the request") {
        // Set the success flag to true to indicate a successful response
        this.success = true;

        // Set the response message
        this.message = message;

        // Set the response data
        this.data = data;

        // Set the error to null (since it's a successful response)
        this.error = null;
    }
}

// Export the SuccessResponse class for use in other modules
module.exports = SuccessResponse;
