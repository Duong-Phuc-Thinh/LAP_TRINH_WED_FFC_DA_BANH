const createCrudController = require('./createCrudController');
const asyncHandler = require('../middleware/asyncHandler');
const {
  tournamentService,
  groupService,
  teamService,
  playerService,
  stadiumService,
  newsService,
  notificationService
} = require('../services/resourceServices');

const newsController = createCrudController(newsService);
newsController.listPublished = asyncHandler(async (req, res) => {
  res.json(await newsService.listPublished());
});

module.exports = {
  tournamentController: createCrudController(tournamentService),
  groupController: createCrudController(groupService),
  teamController: createCrudController(teamService),
  playerController: createCrudController(playerService),
  stadiumController: createCrudController(stadiumService),
  newsController,
  notificationController: createCrudController(notificationService)
};
