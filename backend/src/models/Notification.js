const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    message: { type: DataTypes.STRING(500), allowNull: false },
    type: {
      type: DataTypes.ENUM('MATCH', 'RESULT', 'SYSTEM', 'NEWS'),
      allowNull: false,
      defaultValue: 'SYSTEM'
    },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { tableName: 'notifications' }
);

module.exports = Notification;

