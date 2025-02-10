import Game from '../models/game.js';
import GameRepository from '../repositories/gameRepository.js';

export const getGameById = (req, res) => {
  const { id } = req.params;

  const game = gameRepository.getById(Number(id));

  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json(game);
};

export const listGames = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let games = gameRepository.getAll();

  if (category) {
    games = games.filter(game =>
      game.getCategory().toLowerCase() === category.toLowerCase()
    );
  }

  const start = (page - 1) * limit;
  const paginatedGames = games.slice(start, start + parseInt(limit));

  res.json({ total: games.length, page, limit, data: paginatedGames });
};

export const createGame = (req, res) => {
  const { name, category, price } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: 'Name, category, and price are required!' });
  }

  const newGame = new Game(null, name, category, price);
  const addedGame = gameRepository.add(newGame);
  res.status(201).json(addedGame);
};

export const updateGame = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, price } = req.body;

  const updatedGame = gameRepository.update(id, { name, category, price });

  if (!updatedGame) {
    return res.status(404).json({ error: 'Game not found!' });
  }

  res.json(updatedGame);
};

export const deleteGame = (req, res) => {
  const id = parseInt(req.params.id);

  const deletedGame = gameRepository.delete(id);

  if (!deletedGame) {
    return res.status(404).json({ error: 'Game not found!' });
  }

  res.status(204).send();
};