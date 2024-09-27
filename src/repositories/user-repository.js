const { User } = require("../models");
const CrudRepository = require("./crud-repository");

// UserRepository extends the generic CrudRepository for User-specific operations
class UserRepository extends CrudRepository {
    constructor() {
        // Pass the User model to the CrudRepository
        super(User);
    }

    // Finds a user by email and includes the password field in the response
    async getUserWithPassword(email) {
        const response = await User.findOne({ email }).select("+password");
        return response;
    }
}

// Exporting the UserRepository class for use in other modules
module.exports = UserRepository;
