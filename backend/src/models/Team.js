const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define(
  'Team',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tournamentId: { type: DataTypes.INTEGER, allowNull: true },
    groupId: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    shortName: { type: DataTypes.STRING(10), allowNull: false },
    countryCode: { type: DataTypes.STRING(5), allowNull: true },
    coachName: { type: DataTypes.STRING(120), allowNull: true },
    logoUrl: { type: DataTypes.STRING(500), allowNull: true }
  },
  { tableName: 'teams' }
);

module.exports = Team;

