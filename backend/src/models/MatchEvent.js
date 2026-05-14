const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchEvent = sequelize.define(
  'MatchEvent',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    matchId: { type: DataTypes.INTEGER, allowNull: false },
    teamId: { type: DataTypes.INTEGER, allowNull: true },
    playerId: { type: DataTypes.INTEGER, allowNull: true },
    minute: { type: DataTypes.INTEGER, allowNull: false },
    type: {
      type: DataTypes.ENUM('GOAL', 'OWN_GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION', 'PENALTY', 'VAR', 'OTHER'),
      allowNull: false
    },
    description: { type: DataTypes.STRING(500), allowNull: true }
  },
  { tableName: 'match_events' }
);

module.exports = MatchEvent;

