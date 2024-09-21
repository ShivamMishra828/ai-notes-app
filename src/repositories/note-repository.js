const { Note } = require("../models");
const CrudRepository = require("./crud-repository");

class NoteRepository extends CrudRepository {
    constructor() {
        super(Note);
    }
}

module.exports = NoteRepository;
