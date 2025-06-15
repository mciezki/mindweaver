import cors from 'cors';
import express from 'express';

import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.DOMAIN_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
