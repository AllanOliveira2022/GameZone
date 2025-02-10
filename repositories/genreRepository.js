import { Genre } from '../models';

export const getById = async (id) => {
  return Genre.findByPk(id);
};

export const getAll = async () => {
  return Genre.findAll();
};

export const getByName = async (name) => {
  return Genre.findOne({
    where: {
      name: name
    }
  });
};

export const add = async (genreData) => {
  return Genre.create(genreData);
};

export const update = async (id, updateData) => {
  const genre = await Genre.findByPk(id);
  if (!genre) return null;
  return genre.update(updateData);
};

export const delete = async (id) => {
  const genre = await Genre.findByPk(id);
  if (!genre) return null;
  return genre.destroy();
};