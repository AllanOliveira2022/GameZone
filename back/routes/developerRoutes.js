import express from 'express';
import { getDeveloperById, listDevelopers, createDeveloper, updateDeveloper, deleteDeveloper } from '../controllers/developerController.js';
import { authenticateToken, authorizeRole } from '../middleware/userMiddleware.js';
const router = express.Router();

router.get('/developers', authenticateToken, authorizeRole('admin'), listDevelopers);
router.get('/developers/:id', authenticateToken, authorizeRole('admin'), getDeveloperById);
router.post('/developers', authenticateToken, authorizeRole('admin'), createDeveloper);
router.put('/developers/:id', authenticateToken, authorizeRole('admin'), updateDeveloper);
router.delete('/developers/:id', authenticateToken, authorizeRole('admin'), deleteDeveloper);

export default router;