import express from 'express';
import gameRoutes from './routes/gameRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', gameRoutes);

export default app;