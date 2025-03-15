// controllers/authController.js
import db from '../models/index.js'; 

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expira em 1 hora
    });

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Cria o novo usuário
    const newUser = await db.User.create({ name, email, password });

    // Retorna o usuário criado (sem a senha)
    const user = newUser.get({ plain: true });
    delete user.password;

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

export const listUsers = async (req, res) => {
  try {
    // Busca todos os usuários no banco de dados
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] }, // Exclui a senha do retorno
    });

    res.status(200).json({ message: 'Lista de usuários recuperada com sucesso', users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};