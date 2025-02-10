import express from 'express';
import { getUserById, listUsers, createUser, updateUser, deleteUser, loginUse } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

export default router;