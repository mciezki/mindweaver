import { User } from '@mindweave/types';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', String(process.env.DOMAIN_URL));
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// TODO: prisma connection test
app.get('/users', async (req, res) => {
  try {
    const users: User[] = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
