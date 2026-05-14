const createCrudController = require('./createCrudController');
const {
  tournamentService,
  groupService,
  teamService,
  playerService,
  stadiumService,
  newsService,
  notificationService
} = require('../services/resourceServices');

module.exports = {
  tournamentController: createCrudController(tournamentService),
  groupController: createCrudController(groupService),
  teamController: createCrudController(teamService),
  playerController: createCrudController(playerService),
  stadiumController: createCrudController(stadiumService),
  newsController: createCrudController(newsService),
  notificationController: createCrudController(notificationService)
};

