const { User } = require("../models");
const CrudRepository = require("./crud-repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserWithPassword(email) {
        const response = await User.findOne({ email }).select("+password");
        return response;
    }
}

module.exports = UserRepository;
