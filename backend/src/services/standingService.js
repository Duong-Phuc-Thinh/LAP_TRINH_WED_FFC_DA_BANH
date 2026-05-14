const { Match, Standing, Team, Group } = require('../models');
const httpError = require('../utils/httpError');

async function listByTournament(tournamentId) {
  return Standing.findAll({
    where: { tournamentId },
    include: [
      { model: Team, as: 'team', attributes: ['id', 'name', 'shortName'] },
      { model: Group, as: 'group', attributes: ['id', 'name'] }
    ],
    order: [
      ['groupId', 'ASC'],
      ['rank', 'ASC']
    ]
  });
}

async function recalculateGroup(tournamentId, groupId) {
  const teams = await Team.findAll({ where: { tournamentId, groupId } });
  if (!teams.length) throw httpError(404, 'No teams found in this group');

  const table = new Map();
  teams.forEach((team) => {
    table.set(team.id, emptyRow(tournamentId, groupId, team));
  });

  const matches = await Match.findAll({
    where: { tournamentId, groupId, stage: 'GROUP', status: 'FINISHED' }
  });

  matches.forEach((match) => applyMatch(table, match));

  const rows = Array.from(table.values())
    .sort(compareStanding)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  for (const row of rows) {
    const existed = await Standing.findOne({
      where: { tournamentId, groupId, teamId: row.teamId }
    });

    if (existed) {
      await existed.update(stripTeamName(row));
    } else {
      await Standing.create(stripTeamName(row));
    }
  }

  return listByTournament(tournamentId);
}

function emptyRow(tournamentId, groupId, team) {
  return {
    tournamentId,
    groupId,
    teamId: team.id,
    teamName: team.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    rank: null
  };
}

function applyMatch(table, match) {
  if (match.homeScore === null || match.awayScore === null) return;

  const home = table.get(match.homeTeamId);
  const away = table.get(match.awayTeamId);
  if (!home || !away) return;

  home.played += 1;
  away.played += 1;
  home.goalsFor += match.homeScore;
  home.goalsAgainst += match.awayScore;
  away.goalsFor += match.awayScore;
  away.goalsAgainst += match.homeScore;

  if (match.homeScore > match.awayScore) {
    home.won += 1;
    home.points += 3;
    away.lost += 1;
  } else if (match.homeScore < match.awayScore) {
    away.won += 1;
    away.points += 3;
    home.lost += 1;
  } else {
    home.drawn += 1;
    away.drawn += 1;
    home.points += 1;
    away.points += 1;
  }

  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;
}

function compareStanding(a, b) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.teamName.localeCompare(b.teamName)
  );
}

function stripTeamName(row) {
  const { teamName, ...data } = row;
  return data;
}

module.exports = { listByTournament, recalculateGroup };

