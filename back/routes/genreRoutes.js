import express from 'express';
import { getGenreById, listGenres, createGenre, updateGenre, deleteGenre } from '../controllers/genreController.js';

const router = express.Router();

router.get('/genres', listGenres);
router.get('/genres/:id', getGenreById);
router.post('/genres', createGenre);
router.put('/genres/:id', updateGenre);
router.delete('/genres/:id', deleteGenre);

export default router;