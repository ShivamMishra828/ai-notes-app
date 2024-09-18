class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async findOne(data) {
        const response = await this.model.findOne(data);
        return response;
    }
}

module.exports = CrudRepository;
