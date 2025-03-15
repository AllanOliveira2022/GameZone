import express from 'express';
import { getUserById, listUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;