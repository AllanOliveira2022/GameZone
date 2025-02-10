import { Buy } from '../models';

export const getById = async (id) => {
  return Buy.findByPk(id);
};

export const getAll = async () => {
  return Buy.findAll();
};

export const add = async (buyData) => {
  return Buy.create(buyData);
};

export const update = async (id, updateData) => {
  const buy = await Buy.findByPk(id);
  if (!buy) return null;
  return buy.update(updateData);
};

export const delete = async (id) => {
  const buy = await Buy.findByPk(id);
  if (!buy) return null;
  return buy.destroy();
};