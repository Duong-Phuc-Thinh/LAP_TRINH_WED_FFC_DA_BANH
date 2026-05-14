const { Op } = require('sequelize');
const { Match, Team, Stadium, Tournament, Group, User } = require('../models');
const httpError = require('../utils/httpError');

const matchInclude = [
  { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'shortName'] },
  { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'shortName'] },
  { model: Stadium, as: 'stadium', attributes: ['id', 'name', 'city'] },
  { model: Tournament, as: 'tournament', attributes: ['id', 'name', 'season'] },
  { model: Group, as: 'group', attributes: ['id', 'name'] },
  { model: User, as: 'referee', attributes: ['id', 'fullName', 'email'] }
];

async function list() {
  return Match.findAll({ include: matchInclude, order: [['matchDate', 'ASC']] });
}

async function getById(id) {
  const match = await Match.findByPk(id, { include: matchInclude });
  if (!match) throw httpError(404, 'Match not found');
  return match;
}

async function create(data) {
  await validateSchedule(data);
  const match = await Match.create(data);
  return getById(match.id);
}

async function update(id, data) {
  const match = await getById(id);
  await validateSchedule({ ...match.toJSON(), ...data }, id);
  await Match.update(data, { where: { id } });
  return getById(id);
}

async function remove(id) {
  const match = await getById(id);
  await match.destroy();
  return { deleted: true };
}

async function validateSchedule(data, ignoreMatchId) {
  if (Number(data.homeTeamId) === Number(data.awayTeamId)) {
    throw httpError(400, 'Home team and away team must be different');
  }

  const matchDate = new Date(data.matchDate);
  if (Number.isNaN(matchDate.getTime())) throw httpError(400, 'Invalid matchDate');

  const sameSlotWhere = {
    matchDate,
    status: { [Op.ne]: 'CANCELED' }
  };

  if (ignoreMatchId) sameSlotWhere.id = { [Op.ne]: ignoreMatchId };

  if (data.stadiumId) {
    const stadiumConflict = await Match.findOne({ where: { ...sameSlotWhere, stadiumId: data.stadiumId } });
    if (stadiumConflict) throw httpError(409, 'Stadium already has a match at this time');
  }

  const teamConflict = await Match.findOne({
    where: {
      ...sameSlotWhere,
      [Op.or]: [
        { homeTeamId: data.homeTeamId },
        { awayTeamId: data.homeTeamId },
        { homeTeamId: data.awayTeamId },
        { awayTeamId: data.awayTeamId }
      ]
    }
  });

  if (teamConflict) throw httpError(409, 'One team already has a match at this time');
}

module.exports = { list, getById, create, update, remove, matchInclude };

