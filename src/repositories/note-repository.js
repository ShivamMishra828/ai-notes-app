const { Note, User } = require("../models");
const CrudRepository = require("./crud-repository");

class NoteRepository extends CrudRepository {
    constructor() {
        super(Note);
    }

    async addNotesToUser(id, noteId) {
        const response = await User.findByIdAndUpdate(id, {
            $push: {
                notes: noteId,
            },
        });
        return response;
    }

    async removeNotesToUser(id, noteId) {
        const response = await User.findByIdAndUpdate(
            id,
            {
                $pull: {
                    notes: noteId,
                },
            },
            { new: true }
        );
        return response;
    }
}

module.exports = NoteRepository;
