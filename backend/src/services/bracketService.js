const { Match, Standing, Group, Team } = require('../models');
const httpError = require('../utils/httpError');

async function generateSemiFinals(tournamentId, data) {
  const groups = await Group.findAll({ where: { tournamentId }, order: [['orderNo', 'ASC']] });
  if (groups.length < 2) throw httpError(400, 'At least two groups are required');

  const [groupA, groupB] = groups;
  const topA = await topTeams(tournamentId, groupA.id);
  const topB = await topTeams(tournamentId, groupB.id);
  if (topA.length < 2 || topB.length < 2) throw httpError(400, 'Each group must have at least two ranked teams');

  const existingSemiFinals = await Match.findAll({
    where: { tournamentId, stage: 'KNOCKOUT', round: 'SEMI_FINAL' },
    order: [['matchDate', 'ASC'], ['id', 'ASC']],
    limit: 2
  });

  const match1 = await upsertSemiFinal(existingSemiFinals[0], {
    tournamentId,
    stage: 'KNOCKOUT',
    round: 'SEMI_FINAL',
    homeTeamId: topA[0].teamId,
    awayTeamId: topB[1].teamId,
    stadiumId: data.stadiumId1 || null,
    matchDate: data.matchDate1,
    status: 'SCHEDULED',
    notes: `${groupA.name} #1 vs ${groupB.name} #2`
  });

  const match2 = await upsertSemiFinal(existingSemiFinals[1], {
    tournamentId,
    stage: 'KNOCKOUT',
    round: 'SEMI_FINAL',
    homeTeamId: topB[0].teamId,
    awayTeamId: topA[1].teamId,
    stadiumId: data.stadiumId2 || null,
    matchDate: data.matchDate2,
    status: 'SCHEDULED',
    notes: `${groupB.name} #1 vs ${groupA.name} #2`
  });

  return Match.findAll({
    where: { id: [match1.id, match2.id] },
    include: [
      { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'shortName'] },
      { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'shortName'] }
    ]
  });
}

async function upsertSemiFinal(existingMatch, data) {
  if (existingMatch) {
    await existingMatch.update(data);
    return existingMatch;
  }

  return Match.create(data);
}

async function listKnockout(tournamentId) {
  return Match.findAll({
    where: { tournamentId, stage: 'KNOCKOUT' },
    include: [
      { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'shortName'] },
      { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'shortName'] },
      { model: Team, as: 'winnerTeam', attributes: ['id', 'name', 'shortName'] }
    ],
    order: [['matchDate', 'ASC']]
  });
}

function topTeams(tournamentId, groupId) {
  return Standing.findAll({
    where: { tournamentId, groupId },
    order: [['rank', 'ASC']],
    limit: 2
  });
}

module.exports = { generateSemiFinals, listKnockout };
