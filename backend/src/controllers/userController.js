const asyncHandler = require('../middleware/asyncHandler');
const userService = require('../services/userService');

module.exports = {
  list: asyncHandler(async (req, res) => res.json(await userService.list())),
  getById: asyncHandler(async (req, res) => res.json(await userService.getById(req.params.id))),
  create: asyncHandler(async (req, res) => res.status(201).json(await userService.create(req.body))),
  update: asyncHandler(async (req, res) => res.json(await userService.update(req.params.id, req.body))),
  remove: asyncHandler(async (req, res) => res.json(await userService.remove(req.params.id)))
};

