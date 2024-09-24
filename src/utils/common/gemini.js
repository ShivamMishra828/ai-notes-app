const { ServerConfig } = require("../../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(ServerConfig.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const embeddingModel = genAI.getGenerativeModel({
    model: "text-embedding-004",
});

async function getEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        const embedding = result.embedding;

        if (!embedding) {
            throw new Error("Can't generate embeddings");
        }

        return embedding.values;
    } catch (error) {
        throw new Error("Error generating embeddings");
    }
}

module.exports = { model, getEmbedding };
