const asyncHandler = require('../middleware/asyncHandler');
const standingService = require('../services/standingService');

module.exports = {
  listByTournament: asyncHandler(async (req, res) => {
    res.json(await standingService.listByTournament(req.params.tournamentId));
  }),

  recalculateGroup: asyncHandler(async (req, res) => {
    res.json(await standingService.recalculateGroup(req.params.tournamentId, req.params.groupId));
  })
};

