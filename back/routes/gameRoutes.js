import { Router } from 'express';
import { getGameById, listGames, createGame, updateGame, deleteGame } from '../controllers/gameController.js';
import { authenticateToken, authorizeRole } from '../middleware/userMiddleware.js';

const router = Router();

router.get('/games', authenticateToken, listGames);
router.get('/games/:id', authenticateToken, getGameById);
router.post('/games', authenticateToken, authorizeRole('admin'), createGame);
router.put('/games/:id', authenticateToken, authorizeRole('admin'), updateGame);
router.delete('/games/:id', authenticateToken, authorizeRole('admin'), deleteGame);

export default router;