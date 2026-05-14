const BaseRepository = require('./BaseRepository');
const {
  Role,
  User,
  Tournament,
  Group,
  Team,
  Player,
  Stadium,
  Match,
  MatchEvent,
  Standing,
  News,
  Notification
} = require('../models');

module.exports = {
  roleRepository: new BaseRepository(Role),
  userRepository: new BaseRepository(User),
  tournamentRepository: new BaseRepository(Tournament),
  groupRepository: new BaseRepository(Group),
  teamRepository: new BaseRepository(Team),
  playerRepository: new BaseRepository(Player),
  stadiumRepository: new BaseRepository(Stadium),
  matchRepository: new BaseRepository(Match),
  matchEventRepository: new BaseRepository(MatchEvent),
  standingRepository: new BaseRepository(Standing),
  newsRepository: new BaseRepository(News),
  notificationRepository: new BaseRepository(Notification)
};

