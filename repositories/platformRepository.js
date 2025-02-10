import { Platform } from '../models';

export const getById = async (id) => {
  return Platform.findByPk(id);
};

export const getAll = async () => {
  return Platform.findAll();
};

export const add = async (platformData) => {
  return Platform.create(platformData);
};

export const update = async (id, updateData) => {
  const platform = await Platform.findByPk(id);
  if (!platform) return null;
  return platform.update(updateData);
};

export const delete = async (id) => {
  const platform = await Platform.findByPk(id);
  if (!platform) return null;
  return platform.destroy();
};