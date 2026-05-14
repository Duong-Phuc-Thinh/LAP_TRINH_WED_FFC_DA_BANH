const { Match } = require('../models');
const schedulingService = require('./schedulingService');
const standingService = require('./standingService');
const httpError = require('../utils/httpError');
const { getIO } = require('../sockets');

async function updateResult(matchId, data) {
  const match = await Match.findByPk(matchId);
  if (!match) throw httpError(404, 'Match not found');

  const homeScore = Number(data.homeScore);
  const awayScore = Number(data.awayScore);
  if (homeScore < 0 || awayScore < 0) throw httpError(400, 'Scores must be >= 0');

  const winnerTeamId = calculateWinner(match, homeScore, awayScore);

  await match.update({
    homeScore,
    awayScore,
    winnerTeamId,
    status: data.status || 'FINISHED',
    notes: data.notes ?? match.notes
  });

  let standings = null;
  if (match.stage === 'GROUP' && match.groupId && match.status === 'FINISHED') {
    standings = await standingService.recalculateGroup(match.tournamentId, match.groupId);
  }

  const updatedMatch = await schedulingService.getById(matchId);
  getIO()?.emit('match:result-updated', { match: updatedMatch, standings });
  return { match: updatedMatch, standings };
}

function calculateWinner(match, homeScore, awayScore) {
  if (homeScore > awayScore) return match.homeTeamId;
  if (homeScore < awayScore) return match.awayTeamId;
  return null;
}

module.exports = { updateResult };

