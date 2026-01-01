import { createServer } from 'http';

import app from './app';
import prisma from './database/prisma';
import { initSocket } from './socket';

const port = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');

    const httpServer = createServer(app);
    const io = initSocket(httpServer);

    io.on('connection', (socket) => {
      console.log('🟢 New WebSocket connection:', socket.id);

      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
      });
    });

    httpServer.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
      console.log(`WebSocket server is ready 🚀`);
    });
  } catch (error) {
    console.error('Failed to connect to database or start server:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma disconnected, server shutting down.');
  process.exit(0);
});

main();
