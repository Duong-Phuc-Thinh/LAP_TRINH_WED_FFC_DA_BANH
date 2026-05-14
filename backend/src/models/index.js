const Role = require('./Role');
const User = require('./User');
const UserRole = require('./UserRole');
const Tournament = require('./Tournament');
const Group = require('./Group');
const Team = require('./Team');
const Player = require('./Player');
const Stadium = require('./Stadium');
const Match = require('./Match');
const MatchEvent = require('./MatchEvent');
const Standing = require('./Standing');
const News = require('./News');
const Notification = require('./Notification');

User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'roleId' });

Tournament.hasMany(Group, { as: 'groups', foreignKey: 'tournamentId' });
Group.belongsTo(Tournament, { as: 'tournament', foreignKey: 'tournamentId' });

Tournament.hasMany(Team, { as: 'teams', foreignKey: 'tournamentId' });
Team.belongsTo(Tournament, { as: 'tournament', foreignKey: 'tournamentId' });
Group.hasMany(Team, { as: 'teams', foreignKey: 'groupId' });
Team.belongsTo(Group, { as: 'group', foreignKey: 'groupId' });

Team.hasMany(Player, { as: 'players', foreignKey: 'teamId' });
Player.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });

Tournament.hasMany(Match, { as: 'matches', foreignKey: 'tournamentId' });
Match.belongsTo(Tournament, { as: 'tournament', foreignKey: 'tournamentId' });
Group.hasMany(Match, { as: 'matches', foreignKey: 'groupId' });
Match.belongsTo(Group, { as: 'group', foreignKey: 'groupId' });
Stadium.hasMany(Match, { as: 'matches', foreignKey: 'stadiumId' });
Match.belongsTo(Stadium, { as: 'stadium', foreignKey: 'stadiumId' });
User.hasMany(Match, { as: 'refereeMatches', foreignKey: 'refereeId' });
Match.belongsTo(User, { as: 'referee', foreignKey: 'refereeId' });
Match.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
Match.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
Match.belongsTo(Team, { as: 'winnerTeam', foreignKey: 'winnerTeamId' });

Match.hasMany(MatchEvent, { as: 'events', foreignKey: 'matchId' });
MatchEvent.belongsTo(Match, { as: 'match', foreignKey: 'matchId' });
MatchEvent.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });
MatchEvent.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });

Tournament.hasMany(Standing, { as: 'standings', foreignKey: 'tournamentId' });
Standing.belongsTo(Tournament, { as: 'tournament', foreignKey: 'tournamentId' });
Group.hasMany(Standing, { as: 'standings', foreignKey: 'groupId' });
Standing.belongsTo(Group, { as: 'group', foreignKey: 'groupId' });
Team.hasMany(Standing, { as: 'standings', foreignKey: 'teamId' });
Standing.belongsTo(Team, { as: 'team', foreignKey: 'teamId' });

User.hasMany(News, { as: 'news', foreignKey: 'authorId' });
News.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {
  Role,
  User,
  UserRole,
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
};

