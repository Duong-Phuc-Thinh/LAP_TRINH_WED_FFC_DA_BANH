const asyncHandler = require('../middleware/asyncHandler');
const dashboardService = require('../services/dashboardService');

module.exports = {
  summary: asyncHandler(async (req, res) => {
    res.json(await dashboardService.getSummary());
  })
};

