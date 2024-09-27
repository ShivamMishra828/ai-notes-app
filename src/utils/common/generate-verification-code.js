const otpGenerator = require("otp-generator");

/**
 * Generates a verification code.
 * @param {number} [length=6] - The length of the verification code.
 * @returns {string} The generated verification code.
 */
function generate() {
    const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    // Return generated verification code
    return otp;
}

// Export generate function
module.exports = { generate };
