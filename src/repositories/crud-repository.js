// A generic CRUD repository class for handling basic database operations
class CrudRepository {
    // Constructor receives a Mongoose model and assigns it to this.model
    constructor(model) {
        this.model = model;
    }

    // Creates a new document in the database with the provided data
    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    // Finds one document in the database that matches the provided criteria
    async findOne(data) {
        const response = await this.model.findOne(data);
        return response;
    }

    // Finds all documents that match the provided criteria
    async findAll(data) {
        const response = await this.model.find(data);
        return response;
    }

    // Updates a document by its ID with the new data and returns the updated document
    async update(id, data) {
        const response = await this.model.findByIdAndUpdate(id, data, {
            new: true, // Return the updated document
        });
        return response;
    }

    // Deletes a document by its ID and returns the deleted document
    async delete(id) {
        const response = await this.model.findByIdAndDelete(id);
        return response;
    }
}

// Exporting the CrudRepository class for use in other modules
module.exports = CrudRepository;
