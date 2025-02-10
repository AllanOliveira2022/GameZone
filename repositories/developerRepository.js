import { Developer } from '../models';

export const getById = async (id) => {
  return Developer.findByPk(id);
};

export const getAll = async () => {
  return Developer.findAll();
};

export const add = async (developerData) => {
  return Developer.create(developerData);
};

export const update = async (id, updateData) => {
  const developer = await Developer.findByPk(id);
  if (!developer) return null;
  return developer.update(updateData);
};

export const remove = async (id) => {
  const developer = await Developer.findByPk(id);
  if (!developer) return null;
  return developer.destroy();
};