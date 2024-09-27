const { Note, User } = require("../models");
const CrudRepository = require("./crud-repository");

// NoteRepository extends the generic CrudRepository for Note-specific operations
class NoteRepository extends CrudRepository {
    constructor() {
        // Pass the Note model to the CrudRepository
        super(Note);
    }

    // Adds a note to a user's notes array by pushing the note ID to the user
    async addNotesToUser(id, noteId) {
        const response = await User.findByIdAndUpdate(id, {
            $push: {
                notes: noteId,
            },
        });
        return response;
    }

    // Removes a note from a user's notes array by pulling the note ID from the user
    async removeNotesToUser(id, noteId) {
        const response = await User.findByIdAndUpdate(
            id,
            {
                $pull: {
                    notes: noteId,
                },
            },
            { new: true } // Return the updated user document
        );
        return response;
    }
}

// Exporting the NoteRepository class for use in other modules
module.exports = NoteRepository;
