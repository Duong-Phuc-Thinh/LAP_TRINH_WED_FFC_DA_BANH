class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findAll(options = {}) {
    return this.model.findAll(options);
  }

  findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  count(options = {}) {
    return this.model.count(options);
  }

  create(data, options = {}) {
    return this.model.create(data, options);
  }

  update(id, data, options = {}) {
    return this.model.update(data, { ...options, where: { id } });
  }

  delete(id, options = {}) {
    return this.model.destroy({ ...options, where: { id } });
  }
}

module.exports = BaseRepository;

