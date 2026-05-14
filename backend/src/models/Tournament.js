const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tournament = sequelize.define(
  'Tournament',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    season: { type: DataTypes.STRING(20), allowNull: false },
    hostCountry: { type: DataTypes.STRING(120), allowNull: true },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM('DRAFT', 'OPEN', 'ONGOING', 'FINISHED', 'CANCELED'),
      allowNull: false,
      defaultValue: 'DRAFT'
    },
    format: {
      type: DataTypes.ENUM('GROUP_KNOCKOUT', 'LEAGUE'),
      allowNull: false,
      defaultValue: 'GROUP_KNOCKOUT'
    }
  },
  { tableName: 'tournaments' }
);

module.exports = Tournament;

