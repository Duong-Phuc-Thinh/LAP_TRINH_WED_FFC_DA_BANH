const asyncHandler = require('../middleware/asyncHandler');
const schedulingService = require('../services/schedulingService');
const resultService = require('../services/resultService');

module.exports = {
  list: asyncHandler(async (req, res) => res.json(await schedulingService.list())),
  getById: asyncHandler(async (req, res) => res.json(await schedulingService.getById(req.params.id))),
  create: asyncHandler(async (req, res) => res.status(201).json(await schedulingService.create(req.body))),
  update: asyncHandler(async (req, res) => res.json(await schedulingService.update(req.params.id, req.body))),
  remove: asyncHandler(async (req, res) => res.json(await schedulingService.remove(req.params.id))),
  updateResult: asyncHandler(async (req, res) => {
    res.json(await resultService.updateResult(req.params.id, req.body));
  })
};

