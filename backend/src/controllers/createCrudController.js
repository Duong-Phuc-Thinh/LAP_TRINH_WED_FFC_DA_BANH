const asyncHandler = require('../middleware/asyncHandler');

function createCrudController(service) {
  return {
    list: asyncHandler(async (req, res) => {
      const data = await service.list();
      res.json(data);
    }),

    getById: asyncHandler(async (req, res) => {
      const data = await service.getById(req.params.id);
      res.json(data);
    }),

    create: asyncHandler(async (req, res) => {
      const data = await service.create(req.body);
      res.status(201).json(data);
    }),

    update: asyncHandler(async (req, res) => {
      const data = await service.update(req.params.id, req.body);
      res.json(data);
    }),

    remove: asyncHandler(async (req, res) => {
      const data = await service.remove(req.params.id);
      res.json(data);
    })
  };
}

module.exports = createCrudController;

