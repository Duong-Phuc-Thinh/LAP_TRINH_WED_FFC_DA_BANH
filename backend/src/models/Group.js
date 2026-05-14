const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define(
  'Group',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tournamentId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(20), allowNull: false },
    orderNo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  },
  { tableName: 'groups' }
);

module.exports = Group;

