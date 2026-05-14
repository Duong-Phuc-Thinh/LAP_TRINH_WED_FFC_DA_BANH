const asyncHandler = require('../middleware/asyncHandler');
const bracketService = require('../services/bracketService');

module.exports = {
  listKnockout: asyncHandler(async (req, res) => {
    res.json(await bracketService.listKnockout(req.params.tournamentId));
  }),

  generateSemiFinals: asyncHandler(async (req, res) => {
    res.status(201).json(await bracketService.generateSemiFinals(req.params.tournamentId, req.body));
  })
};

