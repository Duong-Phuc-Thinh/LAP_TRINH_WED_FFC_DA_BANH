const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define(
  'News',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    authorId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM('NEWS', 'ANNOUNCEMENT'),
      allowNull: false,
      defaultValue: 'NEWS'
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'DRAFT'
    },
    publishedAt: { type: DataTypes.DATE, allowNull: true }
  },
  { tableName: 'news' }
);

module.exports = News;

