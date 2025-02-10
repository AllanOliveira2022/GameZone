import { User } from '../models';

export const getById = async (id) => {
  return User.findByPk(id);
};

export const getAll = async () => {
  return User.findAll();
};

export const getByEmailOrPhone = async (email, phone) => {
  return User.findOne({
    where: {
      [Op.or]: [
        { email: email },
        { phone: phone }
      ]
    }
  });
};

export const getByEmail = async (email) => {
  return User.findOne({
    where: {
      email: email
    }
  });
};

export const add = async (userData) => {
  return User.create(userData);
};

export const update = async (id, updateData) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return user.update(updateData);
};

export const delete = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return user.destroy();
};