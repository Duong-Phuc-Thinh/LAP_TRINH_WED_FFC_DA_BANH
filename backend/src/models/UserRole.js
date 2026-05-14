const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define(
  'UserRole',
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    roleId: { type: DataTypes.INTEGER, primaryKey: true }
  },
  { tableName: 'user_roles', timestamps: false }
);

module.exports = UserRole;

