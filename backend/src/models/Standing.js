const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Standing = sequelize.define(
  'Standing',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tournamentId: { type: DataTypes.INTEGER, allowNull: false },
    groupId: { type: DataTypes.INTEGER, allowNull: true },
    teamId: { type: DataTypes.INTEGER, allowNull: false },
    played: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    won: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    drawn: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    lost: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    goalsFor: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    goalsAgainst: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    goalDifference: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    rank: { type: DataTypes.INTEGER, allowNull: true }
  },
  {
    tableName: 'standings',
    indexes: [{ unique: true, fields: ['tournament_id', 'group_id', 'team_id'] }]
  }
);

module.exports = Standing;

