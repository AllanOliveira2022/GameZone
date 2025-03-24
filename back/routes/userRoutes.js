import express from 'express';
import { signUp, login, listUsers } from '../controllers/userController.js'; // Importando os controllers
import { authenticateToken, authorizeUser, authorizeRole } from '../middleware/userMiddleware.js'; // Importando os middlewares

const router = express.Router();

// Rotas públicas
// Cadastro de um novo usuário
router.post('/signup', signUp);

// Login de um usuário
router.post('/login', login);

// Rota protegida para listar todos os usuários (somente admin)
router.get('/users', authenticateToken, authorizeUser, authorizeRole('admin'), listUsers);

export default router;