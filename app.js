import express from 'express';
import buyRoutes from './routes/buyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import avaliationRoutes from './routes/avaliationRoutes.js';
import developerRoutes from './routes/developerRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import platformRoutes from './routes/platformRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', gameRoutes);
app.use('/api', userRoutes);
app.use('/api', buyRoutes);
app.use('/api', avaliationRoutes);
app.use('/api', developerRoutes);
app.use('/api', genreRoutes);
app.use('/api', platformRoutes);

export default app;