const httpError = require('../utils/httpError');

class CrudService {
  constructor(repository, defaultOptions = {}) {
    this.repository = repository;
    this.defaultOptions = defaultOptions;
  }

  list(options = {}) {
    return this.repository.findAll({ ...this.defaultOptions, ...options });
  }

  async getById(id, options = {}) {
    const entity = await this.repository.findById(id, { ...this.defaultOptions, ...options });
    if (!entity) throw httpError(404, 'Resource not found');
    return entity;
  }

  create(data) {
    return this.repository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    await this.repository.update(id, data);
    return this.getById(id);
  }

  async remove(id) {
    await this.getById(id);
    await this.repository.delete(id);
    return { deleted: true };
  }
}

module.exports = CrudService;

