import express from 'express';
import { getUserBuys,signUp, login, listUsers, getUserGames} from '../controllers/userController.js'; // Importando os controllers
import { authenticateToken, authorizeRole } from '../middleware/userMiddleware.js'; // Importando os middlewares

const router = express.Router();

// Rotas públicas
// Cadastro de um novo usuário
router.post('/signup', signUp);

// Login de um usuário
router.post('/login', login);

// Rota protegida para listar todos os usuários (somente admin)
router.get('/users', authenticateToken, authorizeRole('admin'), listUsers);

router.get('/users/games', authenticateToken, getUserGames);
router.get('/users/:userId/buys', authenticateToken,getUserBuys); 

export default router;