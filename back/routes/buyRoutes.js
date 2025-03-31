import express from 'express';
import { getBuyById, listBuys, createBuy, updateBuy, deleteBuy } from '../controllers/buyController.js';
import { authenticateToken, authorizeRole } from '../middleware/userMiddleware.js'; // Importando os middlewares

const router = express.Router();

router.get('/buys', listBuys);
router.get('/buys/:id', authenticateToken,getBuyById);
router.post('/buys', createBuy);
router.put('/buys/:id', updateBuy);
router.delete('/buys/:id', deleteBuy);

export default router;