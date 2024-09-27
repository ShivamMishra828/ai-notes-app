const { ServerConfig } = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI model
const genAI = new GoogleGenerativeAI(ServerConfig.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize embedding model
const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
});

/**
 * Generates an embedding for the given text.
 *
 * @async
 * @param {string} text - The text to generate an embedding for.
 * @returns {Promise<array>} The generated embedding.
 * @throws {Error} If embedding generation fails.
 */
async function getEmbedding(text) {
    try {
        // Generate embedding using embedding model
        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding;

        // Check if embedding is generated
        if (!embedding) {
            throw new Error("Can't generate embeddings");
        }
        // Return embedding values
        return embedding.values;
    } catch (error) {
        // Handle embedding generation errors
        throw new Error("Error generating embeddings");
    }
}

// Export getEmbedding function and Gemini model
module.exports = { model, getEmbedding };
