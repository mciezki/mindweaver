import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

import { socketAuthMiddleware } from './middlewares/socket-auth.middleware';

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.DOMAIN_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket) => {
    const user = socket.data.user;

    console.log(
      `🟢 User connected: ${user?.email} (${user?.userId}) | Socket ID: ${socket.id}`,
    );

    if (user?.userId) {
      socket.join(user.userId);
      console.log(`User ${user.userId} joined their private room.`);
    }

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${user?.email}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }

  return io;
};
