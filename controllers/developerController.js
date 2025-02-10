import Developer from '../models/developer.js';
import DeveloperRepository from '../repositories/developerRepository.js';

export const getDeveloperById = (req, res) => {
  const { id } = req.params;

  const developer = developerRepository.getById(Number(id));

  if (!developer) {
    return res.status(404).json({ error: 'Developer not found' });
  }

  res.json(developer);
};

export const listDevelopers = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let developers = developerRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedDevelopers = developers.slice(start, start + parseInt(limit));

  res.json({ total: developers.length, page, limit, data: paginatedDevelopers });
};

export const createDeveloper = (req, res) => {
  const { name, CNPJ, email, phone } = req.body;

  if (!name || !CNPJ || !email || !phone) {
    return res.status(400).json({ error: 'Name, CNPJ, email, and phone are required!' });
  }

  const newDeveloper = new Developer(null, name, CNPJ, email, phone);
  const addedDeveloper = developerRepository.add(newDeveloper);
  res.status(201).json(addedDeveloper);
};

export const updateDeveloper = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, CNPJ, email, phone } = req.body;

  const updatedDeveloper = developerRepository.update(id, { name, CNPJ, email, phone });

  if (!updatedDeveloper) {
    return res.status(404).json({ error: 'Developer not found!' });
  }

  res.json(updatedDeveloper);
};

export const deleteDeveloper = (req, res) => {
  const id = parseInt(req.params.id);

  const deletedDeveloper = developerRepository.delete(id);

  if (!deletedDeveloper) {
    return res.status(404).json({ error: 'Developer not found!' });
  }

  res.status(204).send();
};