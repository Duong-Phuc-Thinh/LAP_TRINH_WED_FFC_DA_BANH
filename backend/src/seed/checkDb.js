require('dotenv').config();

const sequelize = require('../config/database');

async function checkDb() {
  try {
    await sequelize.authenticate();
    console.log('Database connection OK');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`Database: ${process.env.DB_NAME || 'aff_cup_organizer'}`);
    console.log(`User: ${process.env.DB_USER || 'root'}`);
    await sequelize.close();
  } catch (error) {
    console.error('Database connection failed');
    console.error(error.original?.sqlMessage || error.message);
    console.error('');
    console.error('Check backend/.env: DB_USER and DB_PASSWORD must match your MySQL account.');
    console.error('If password contains #, spaces, or special characters, wrap it in double quotes.');
    process.exit(1);
  }
}

checkDb();

