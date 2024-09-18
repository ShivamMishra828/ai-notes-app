// Import required modules and configurations
const nodemailer = require("nodemailer");
const { ServerConfig } = require("../../config");

// Create a nodemailer transporter object with the server's mail settings
const transporter = nodemailer.createTransport({
    host: ServerConfig.MAIL_HOST,
    port: ServerConfig.MAIL_PORT,
    auth: {
        user: ServerConfig.MAIL_USER,
        pass: ServerConfig.MAIL_PASS,
    },
});

/**
 * Sends an email using the nodemailer transporter
 * @param {object} data - The email data
 * @param {string} data.receiverInfo - The recipient's email address
 * @param {string} data.subject - The email subject
 * @param {string} data.body - The email body (HTML content)
 * @returns {Promise<object|null>} The response from the email send operation
 */
async function sendMail(data) {
    try {
        // Extract the email data from the input object
        const { receiverInfo, subject, body } = data;

        // Use the transporter to send the email
        const response = await transporter.sendMail({
            from: ServerConfig.MAIL_USER,
            to: receiverInfo,
            subject,
            html: body,
        });

        // Return the response from the email send operation
        return response;
    } catch (error) {
        // Log any errors that occur during email sending
        console.log(
            `Something went wrong while sending mail to user:- ${error}`
        );
        // Return null to indicate failure
        return null;
    }
}

// Export the sendMail function for use in other modules
module.exports = { sendMail };
