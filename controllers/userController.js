import User from '../models/user.js';
import UserRepository from '../repositories/userRepository.js';

export const getUserById = (req, res) => {
  const { id } = req.params;

  const user = userRepository.getById(Number(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
};

export const listUsers = (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let users = userRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedUsers = users.slice(start, start + parseInt(limit));

  res.json({ total: users.length, page, limit, data: paginatedUsers });
};

export const createUser = async (req, res) => {
  const { name, dateBirth, email, phone, address, buyID, password } = req.body;

  if (!name || !dateBirth || !email || !phone || !address || !buyID || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = await userRepository.getByEmailOrPhone(email, phone);
  if (existingUser) {
    return res.status(400).json({ error: 'Email or phone already exists' });
  }

  const newUser = new User(null, name, dateBirth, email, phone, address, buyID, password);
  const addedUser = userRepository.add(newUser);

  res.status(201).json(addedUser);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, dateBirth, email, phone, address, buyID, password } = req.body;

  const userToUpdate = await userRepository.getById(Number(id));

  if (!userToUpdate) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updatedUser = await userRepository.update(id, { name, dateBirth, email, phone, address, buyID, password: password || userToUpdate.password });

  res.json(updatedUser);
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  const deletedUser = userRepository.delete(Number(id));

  if (!deletedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(204).send();
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await userRepository.getByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user });
};