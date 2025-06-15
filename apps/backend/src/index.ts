import app from './app';
import prisma from './database/prisma';

const port = process.env.PORT || 4000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
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
