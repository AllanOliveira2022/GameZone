import Genre from '../models/genre.js';
import GenreRepository from '../repositories/genreRepository.js';

export const getGenreById = async (req, res) => {
  const { id } = req.params;

  const genre = await GenreRepository.getById(Number(id));

  if (!genre) {
    return res.status(404).json({ error: 'Genre not found' });
  }

  res.json(genre);
};

export const listGenres = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let genres = await GenreRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedGenres = genres.slice(start, start + parseInt(limit));

  res.json({ total: genres.length, page, limit, data: paginatedGenres });
};

export const createGenre = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const existingGenre = await GenreRepository.getByName(name);
  if (existingGenre) {
    return res.status(400).json({ error: 'Genre already exists' });
  }

  const newGenre = new Genre(null, name);
  const addedGenre = await GenreRepository.add(newGenre);

  res.status(201).json(addedGenre);
};

export const updateGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const genreToUpdate = await GenreRepository.getById(Number(id));

  if (!genreToUpdate) {
    return res.status(404).json({ error: 'Genre not found' });
  }

  const updatedGenre = await GenreRepository.update(id, { name });

  res.json(updatedGenre);
};

export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  const deletedGenre = await GenreRepository.delete(Number(id));

  if (!deletedGenre) {
    return res.status(404).json({ error: 'Genre not found' });
  }

  res.status(204).send();
};