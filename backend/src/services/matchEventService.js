const { MatchEvent, Match, Team, Player } = require('../models');
const httpError = require('../utils/httpError');
const { getIO } = require('../sockets');

const include = [
  { model: Match, as: 'match', attributes: ['id', 'matchDate', 'status'] },
  { model: Team, as: 'team', attributes: ['id', 'name', 'shortName'] },
  { model: Player, as: 'player', attributes: ['id', 'fullName', 'shirtNumber'] }
];

async function list() {
  return MatchEvent.findAll({ include, order: [['matchId', 'ASC'], ['minute', 'ASC']] });
}

async function listByMatch(matchId) {
  return MatchEvent.findAll({ where: { matchId }, include, order: [['minute', 'ASC']] });
}

async function create(data) {
  const match = await Match.findByPk(data.matchId);
  if (!match) throw httpError(404, 'Match not found');

  const event = await MatchEvent.create(data);
  const payload = await MatchEvent.findByPk(event.id, { include });
  getIO()?.emit('match:event-created', payload);
  return payload;
}

async function update(id, data) {
  const event = await MatchEvent.findByPk(id);
  if (!event) throw httpError(404, 'Match event not found');
  await event.update(data);
  return MatchEvent.findByPk(id, { include });
}

async function remove(id) {
  const event = await MatchEvent.findByPk(id);
  if (!event) throw httpError(404, 'Match event not found');
  await event.destroy();
  return { deleted: true };
}

module.exports = { list, listByMatch, create, update, remove };

