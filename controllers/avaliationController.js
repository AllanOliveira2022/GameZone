import Avaliation from '../models/avaliation.js';
import AvaliationRepository from '../repositories/avaliationRepository.js';

export const getAvaliationById = async (req, res) => {
  const { id } = req.params;

  const avaliation = await AvaliationRepository.getById(Number(id));

  if (!avaliation) {
    return res.status(404).json({ error: 'Avaliation not found' });
  }

  res.json(avaliation);
};

export const listAvaliations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let avaliations = await AvaliationRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedAvaliations = avaliations.slice(start, start + parseInt(limit));

  res.json({ total: avaliations.length, page, limit, data: paginatedAvaliations });
};

export const createAvaliation = async (req, res) => {
  const { score, comment } = req.body;

  if (!score || !comment) {
    return res.status(400).json({ error: 'Score and comment are required' });
  }

  if (score < 1 || score > 5) {
    return res.status(400).json({ error: 'Score must be between 1 and 5' });
  }

  const newAvaliation = new Avaliation(null, score, comment);
  const addedAvaliation = await AvaliationRepository.add(newAvaliation);

  res.status(201).json(addedAvaliation);
};

export const updateAvaliation = async (req, res) => {
  const { id } = req.params;
  const { score, comment } = req.body;

  const avaliationToUpdate = await AvaliationRepository.getById(Number(id));

  if (!avaliationToUpdate) {
    return res.status(404).json({ error: 'Avaliation not found' });
  }

  if (score < 1 || score > 5) {
    return res.status(400).json({ error: 'Score must be between 1 and 5' });
  }

  const updatedAvaliation = await AvaliationRepository.update(id, { score, comment });

  res.json(updatedAvaliation);
};

export const deleteAvaliation = async (req, res) => {
  const { id } = req.params;

  const deletedAvaliation = await AvaliationRepository.delete(Number(id));

  if (!deletedAvaliation) {
    return res.status(404).json({ error: 'Avaliation not found' });
  }

  res.status(204).send();
};