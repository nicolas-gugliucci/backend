import {Server} from 'socket.io'

let io;
const socketConnection = (server) => {
  io = new Server(server);
  io.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

const sendMessage = (key, message) => io.emit(key, message);

export {socketConnection,sendMessage, io}