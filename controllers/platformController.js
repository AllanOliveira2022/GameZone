import Platform from '../models/platform.js';
import PlatformRepository from '../repositories/platformRepository.js';

export const getPlatformById = async (req, res) => {
  const { id } = req.params;

  const platform = await PlatformRepository.getById(Number(id));

  if (!platform) {
    return res.status(404).json({ error: 'Platform not found' });
  }

  res.json(platform);
};

export const listPlatforms = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let platforms = await PlatformRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedPlatforms = platforms.slice(start, start + parseInt(limit));

  res.json({ total: platforms.length, page, limit, data: paginatedPlatforms });
};

export const createPlatform = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newPlatform = new Platform(null, name);
  const addedPlatform = await PlatformRepository.add(newPlatform);

  res.status(201).json(addedPlatform);
};

export const updatePlatform = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const platformToUpdate = await PlatformRepository.getById(Number(id));

  if (!platformToUpdate) {
    return res.status(404).json({ error: 'Platform not found' });
  }

  const updatedPlatform = await PlatformRepository.update(id, { name });

  res.json(updatedPlatform);
};

export const deletePlatform = async (req, res) => {
  const { id } = req.params;

  const deletedPlatform = await PlatformRepository.delete(Number(id));

  if (!deletedPlatform) {
    return res.status(404).json({ error: 'Platform not found' });
  }

  res.status(204).send();
};