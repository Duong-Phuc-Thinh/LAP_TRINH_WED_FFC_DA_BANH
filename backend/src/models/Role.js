const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255), allowNull: true }
  },
  { tableName: 'roles' }
);

module.exports = Role;

