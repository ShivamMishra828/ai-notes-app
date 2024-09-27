const { Pinecone } = require("@pinecone-database/pinecone");
const { PINECONE_API_KEY } = require("../config/server-config");

// Ensure the Pinecone API key is available
const apiKey = PINECONE_API_KEY;
if (!apiKey) {
    throw Error("Pinecone API key is not set");
}

// Initialize Pinecone client with the API key
const pinecone = new Pinecone({
    apiKey,
});

// Define the index for storing notes in Pinecone
const notesIndex = pinecone.Index("ai-notes-app");

// Exporting the notesIndex object to be used in other modules
module.exports = { notesIndex };
