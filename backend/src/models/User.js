const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'LOCKED'),
      allowNull: false,
      defaultValue: 'ACTIVE'
    }
  },
  { tableName: 'users' }
);

module.exports = User;

