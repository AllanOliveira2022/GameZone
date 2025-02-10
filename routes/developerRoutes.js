import express from 'express';
import { getDeveloperById, listDevelopers, createDeveloper, updateDeveloper, deleteDeveloper } from '../controllers/developerController.js';

const router = express.Router();

router.get('/developers', listDevelopers);
router.get('/developers/:id', getDeveloperById);
router.post('/developers', createDeveloper);
router.put('/developers/:id', updateDeveloper);
router.delete('/developers/:id', deleteDeveloper);

export default router;