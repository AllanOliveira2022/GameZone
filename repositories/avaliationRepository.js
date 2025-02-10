import { Avaliation } from '../models';

export const getById = async (id) => {
  return Avaliation.findByPk(id);
};

export const getAll = async () => {
  return Avaliation.findAll();
};

export const add = async (avaliationData) => {
  return Avaliation.create(avaliationData);
};

export const update = async (id, updateData) => {
  const avaliation = await Avaliation.findByPk(id);
  if (!avaliation) return null;
  return avaliation.update(updateData);
};

export const delete = async (id) => {
  const avaliation = await Avaliation.findByPk(id);
  if (!avaliation) return null;
  return avaliation.destroy();
};