import express from 'express';
import userRoutes from './routes/userRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import developerRoutes from './routes/developerRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import cors from 'cors';
import avaliationRoutes from './routes/avaliationRoutes.js';
import buyRoutes from './routes/buyRoutes.js';

const app = express();

app.use(cors());

// OU configuração mais segura (recomendado para produção)
app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true // Se você usa cookies/tokens
}));

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', platformRoutes);
app.use('/api', gameRoutes);
app.use('/api', developerRoutes);
app.use('/api', genreRoutes);
app.use('/api', avaliationRoutes);
app.use('/api', buyRoutes);

export default app;