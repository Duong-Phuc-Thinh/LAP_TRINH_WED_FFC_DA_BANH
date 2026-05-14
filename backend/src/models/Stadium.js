const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stadium = sequelize.define(
  'Stadium',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    city: { type: DataTypes.STRING(120), allowNull: false },
    country: { type: DataTypes.STRING(120), allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true }
  },
  { tableName: 'stadiums' }
);

module.exports = Stadium;

