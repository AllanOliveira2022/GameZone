import express from 'express';
import { getPlatformById, listPlatforms, createPlatform, updatePlatform, deletePlatform } from '../controllers/platformController.js';

const router = express.Router();

router.get('/platforms', listPlatforms);
router.get('/platforms/:id', getPlatformById);
router.post('/platforms', createPlatform);
router.put('/platforms/:id', updatePlatform);
router.delete('/platforms/:id', deletePlatform);

export default router;