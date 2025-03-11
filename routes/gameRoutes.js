import { Router } from 'express';
import { getGameById, listGames, createGame, updateGame, deleteGame } from '../controllers/gameController.js';

const router = Router();

router.get('/games', listGames);
router.get('/games/:id', getGameById);
router.post('/games', createGame);
router.put('/games/:id', updateGame);

router.delete('/games/:id', deleteGame);

export default router;
