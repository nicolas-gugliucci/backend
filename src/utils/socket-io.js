import { Server } from 'socket.io'
import { messageModel } from '../dao/models/messages.js';

let io;

const socketConnection = (server) => {
  io = new Server(server);
  io.on('connection', async (socket) => {
    socket.on('authorized', async (data) => {
      if (data) {
        const messages = await messageModel.find().lean()
        io.emit('messageLogs', messages)
      }
    })
    socket.on('message', async (data) => {
      const message = await messageModel.create(data)
      const messages = await messageModel.find().lean()
      io.emit('messageLogs', messages)
    })
    console.info(`Client connected [id=${socket.id}]`);
    socket.on('disconnect', () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

const sendMessage = (key, message) => io.emit(key, message);

export { socketConnection, sendMessage, io }