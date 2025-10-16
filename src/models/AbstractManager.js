class AbstractManager {
  constructor({ model }) {
    this.model = model;
  }

  find(id) {
    return this.model.findById(id);
  }

  findAll() {
    return this.model.find({});
  }

  delete(id) {
    return this.model.delete(id);
  }
}

module.exports = AbstractManager;
