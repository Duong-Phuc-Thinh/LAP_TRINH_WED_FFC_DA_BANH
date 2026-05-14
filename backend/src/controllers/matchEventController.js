const asyncHandler = require('../middleware/asyncHandler');
const matchEventService = require('../services/matchEventService');

module.exports = {
  list: asyncHandler(async (req, res) => res.json(await matchEventService.list())),
  listByMatch: asyncHandler(async (req, res) => res.json(await matchEventService.listByMatch(req.params.matchId))),
  create: asyncHandler(async (req, res) => res.status(201).json(await matchEventService.create(req.body))),
  update: asyncHandler(async (req, res) => res.json(await matchEventService.update(req.params.id, req.body))),
  remove: asyncHandler(async (req, res) => res.json(await matchEventService.remove(req.params.id)))
};

