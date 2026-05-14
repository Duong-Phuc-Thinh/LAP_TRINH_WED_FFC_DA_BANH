const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define(
  'Player',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    teamId: { type: DataTypes.INTEGER, allowNull: false },
    fullName: { type: DataTypes.STRING(120), allowNull: false },
    shirtNumber: { type: DataTypes.INTEGER, allowNull: true },
    position: {
      type: DataTypes.ENUM('GK', 'DF', 'MF', 'FW'),
      allowNull: false,
      defaultValue: 'MF'
    },
    birthDate: { type: DataTypes.DATEONLY, allowNull: true },
    nationality: { type: DataTypes.STRING(80), allowNull: true }
  },
  { tableName: 'players' }
);

module.exports = Player;

