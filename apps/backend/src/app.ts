import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import threadsRoutes from './modules/threads/threads.routes';
import usersRoutes from './modules/users/users.routes';
import publicationsRoutes from './modules/publications/publications.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.DOMAIN_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/threads', threadsRoutes);
app.use('/api/publications', publicationsRoutes);

app.use(errorHandler);

export default app;
