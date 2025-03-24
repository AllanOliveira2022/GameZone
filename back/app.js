import express from 'express';
import userRoutes from './routes/userRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import developerRoutes from './routes/developerRoutes.js';
import genreRoutes from './routes/genreRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', platformRoutes);
app.use('/api', gameRoutes);
app.use('/api', developerRoutes);
app.use('/api', genreRoutes);

export default app;