const { Pinecone } = require("@pinecone-database/pinecone");
const { PINECONE_API_KEY } = require("../config/server-config");

const apiKey = PINECONE_API_KEY;
if (!apiKey) {
    throw Error("Pinecone api key is not set");
}

const pinecone = new Pinecone({
    apiKey,
});

const notesIndex = pinecone.Index("ai-notes-app");

module.exports = { notesIndex };
