const { Server } = require('socket.io');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    socket.on('match:join', (matchId) => socket.join(`match:${matchId}`));
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };

