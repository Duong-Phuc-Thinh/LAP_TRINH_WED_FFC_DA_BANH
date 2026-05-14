const {
  User,
  Tournament,
  Team,
  Player,
  Stadium,
  Match,
  MatchEvent,
  News
} = require('../models');

async function getSummary() {
  const [users, tournaments, teams, players, stadiums, matches, events, news, liveMatches] = await Promise.all([
    User.count(),
    Tournament.count(),
    Team.count(),
    Player.count(),
    Stadium.count(),
    Match.count(),
    MatchEvent.count(),
    News.count(),
    Match.count({ where: { status: 'LIVE' } })
  ]);

  return {
    users,
    tournaments,
    teams,
    players,
    stadiums,
    matches,
    events,
    news,
    liveMatches
  };
}

module.exports = { getSummary };

