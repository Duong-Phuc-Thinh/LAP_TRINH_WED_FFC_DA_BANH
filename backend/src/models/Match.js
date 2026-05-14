const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define(
  'Match',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tournamentId: { type: DataTypes.INTEGER, allowNull: false },
    groupId: { type: DataTypes.INTEGER, allowNull: true },
    stadiumId: { type: DataTypes.INTEGER, allowNull: true },
    homeTeamId: { type: DataTypes.INTEGER, allowNull: false },
    awayTeamId: { type: DataTypes.INTEGER, allowNull: false },
    refereeId: { type: DataTypes.INTEGER, allowNull: true },
    matchDate: { type: DataTypes.DATE, allowNull: false },
    stage: {
      type: DataTypes.ENUM('GROUP', 'KNOCKOUT'),
      allowNull: false,
      defaultValue: 'GROUP'
    },
    round: {
      type: DataTypes.ENUM('GROUP_STAGE', 'QUARTER_FINAL', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL'),
      allowNull: false,
      defaultValue: 'GROUP_STAGE'
    },
    status: {
      type: DataTypes.ENUM('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELED'),
      allowNull: false,
      defaultValue: 'SCHEDULED'
    },
    homeScore: { type: DataTypes.INTEGER, allowNull: true },
    awayScore: { type: DataTypes.INTEGER, allowNull: true },
    winnerTeamId: { type: DataTypes.INTEGER, allowNull: true },
    notes: { type: DataTypes.STRING(500), allowNull: true }
  },
  { tableName: 'matches' }
);

module.exports = Match;

