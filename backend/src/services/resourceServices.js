const CrudService = require('./CrudService');
const {
  tournamentRepository,
  groupRepository,
  teamRepository,
  playerRepository,
  stadiumRepository,
  newsRepository,
  notificationRepository
} = require('../repositories');
const { Group, Team, Player, Tournament, User } = require('../models');
const slugify = require('../utils/slugify');

const tournamentService = new CrudService(tournamentRepository, {
  order: [['startDate', 'DESC']]
});

const groupService = new CrudService(groupRepository, {
  include: [{ model: Tournament, as: 'tournament', attributes: ['id', 'name', 'season'] }],
  order: [['orderNo', 'ASC']]
});

const teamService = new CrudService(teamRepository, {
  include: [
    { model: Group, as: 'group', attributes: ['id', 'name'] },
    { model: Tournament, as: 'tournament', attributes: ['id', 'name', 'season'] }
  ],
  order: [['name', 'ASC']]
});

const playerService = new CrudService(playerRepository, {
  include: [{ model: Team, as: 'team', attributes: ['id', 'name', 'shortName'] }],
  order: [['teamId', 'ASC'], ['shirtNumber', 'ASC']]
});

const stadiumService = new CrudService(stadiumRepository, {
  order: [['name', 'ASC']]
});

const notificationService = new CrudService(notificationRepository, {
  include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'email'] }],
  order: [['createdAt', 'DESC']]
});

const newsService = new CrudService(newsRepository, {
  include: [{ model: User, as: 'author', attributes: ['id', 'fullName'] }],
  order: [['createdAt', 'DESC']]
});

const originalNewsCreate = newsService.create.bind(newsService);
newsService.create = (data) => {
  const slug = data.slug || `${slugify(data.title)}-${Date.now()}`;
  return originalNewsCreate({ ...data, slug });
};

module.exports = {
  tournamentService,
  groupService,
  teamService,
  playerService,
  stadiumService,
  newsService,
  notificationService
};

