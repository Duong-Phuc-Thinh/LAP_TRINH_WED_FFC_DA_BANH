const { Match, Standing, Group, Team, Stadium } = require('../models');
const httpError = require('../utils/httpError');

const knockoutInclude = [
  { model: Team, as: 'homeTeam', attributes: ['id', 'name', 'shortName'] },
  { model: Team, as: 'awayTeam', attributes: ['id', 'name', 'shortName'] },
  { model: Team, as: 'winnerTeam', attributes: ['id', 'name', 'shortName'] },
  { model: Stadium, as: 'stadium', attributes: ['id', 'name', 'city'] }
];

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
    include: knockoutInclude
  });
}

async function upsertSemiFinal(existingMatch, data) {
  if (existingMatch) {
    await existingMatch.update(data);
    return existingMatch;
  }

  return Match.create(data);
}

async function generateFinal(tournamentId, data) {
  const matchDate = new Date(data.matchDate);
  if (Number.isNaN(matchDate.getTime())) throw httpError(400, 'Final matchDate is required');

  const semiFinals = await Match.findAll({
    where: { tournamentId, stage: 'KNOCKOUT', round: 'SEMI_FINAL', status: 'FINISHED' },
    order: [['matchDate', 'ASC'], ['id', 'ASC']],
    limit: 2
  });

  if (semiFinals.length < 2) {
    throw httpError(400, 'Two finished semifinals are required before generating the final');
  }

  if (!semiFinals[0].winnerTeamId || !semiFinals[1].winnerTeamId) {
    throw httpError(400, 'Both semifinals must have winners');
  }

  const finalData = {
    tournamentId,
    stage: 'KNOCKOUT',
    round: 'FINAL',
    homeTeamId: semiFinals[0].winnerTeamId,
    awayTeamId: semiFinals[1].winnerTeamId,
    stadiumId: data.stadiumId || null,
    matchDate: data.matchDate,
    status: 'SCHEDULED',
    notes: 'Winner semifinal 1 vs winner semifinal 2'
  };

  const existingFinal = await Match.findOne({
    where: { tournamentId, stage: 'KNOCKOUT', round: 'FINAL' }
  });

  const final = existingFinal ? await existingFinal.update(finalData) : await Match.create(finalData);
  return Match.findByPk(final.id, { include: knockoutInclude });
}

async function listKnockout(tournamentId) {
  return Match.findAll({
    where: { tournamentId, stage: 'KNOCKOUT' },
    include: knockoutInclude,
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

module.exports = { generateSemiFinals, generateFinal, listKnockout };
