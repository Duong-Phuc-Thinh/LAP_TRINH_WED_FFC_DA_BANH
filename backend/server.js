require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const sequelize = require('./src/config/database');
const { initSocket } = require('./src/sockets');
require('./src/models');

const port = process.env.PORT || 4000;
const server = http.createServer(app);

initSocket(server);

async function bootstrap() {
  try {
    await sequelize.authenticate();

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
    }

    server.listen(port, () => {
      console.log(`AFF Cup API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Cannot start server:', error.message);
    process.exit(1);
  }
}

bootstrap();

