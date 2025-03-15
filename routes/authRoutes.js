// routes/authRoutes.js
import express from 'express';
import { signUp, login, listUsers } from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.post('/signup', signUp);
router.post('/login', login);

// Rota protegida para listar usuários (apenas admin)
router.get('/users', authenticateToken, authorizeRole('admin'), listUsers);

export default router;