import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import db from '../models/index.js';

/**
 * Login de usuário
 */
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

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido',
      token,
      role: user.role,
      id: user.id,
      name: user.name
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

/**
 * Cadastro de novo usuário
 */
export const signUp = async (req, res) => {
  const { name, email, dateBirth, phone, address, password, role = 'user' } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com esse Email!' });
    }

    if (!phone) {
      return res.status(400).json({ message: 'Telefone é obrigatório' });
    }

    const existingPhone = await db.User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Já existe um usuário com esse Telefone!' });
    }

    const newUser = await db.User.create({
      name, email, dateBirth, phone, address, password, role
    });

    const user = newUser.get({ plain: true });
    delete user.password;

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

/**
 * Lista todos os usuários (sem senhas)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({ message: 'Lista de usuários recuperada com sucesso', users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

/**
 * Retorna os jogos adquiridos por um usuário autenticado
 */
export const getUserGames = async (req, res) => {
  const userID = req.user?.id;

  try {
    const userGames = await db.ItemJogo.findAll({
      include: [
        {
          model: db.Buy,
          as: 'compra',
          where: { userID },
          attributes: []
        },
        {
          model: db.Game,
          as: 'jogo',
          attributes: ['id', 'name', 'price', 'description']
        }
      ],
      attributes: []
    });

    if (!userGames.length) {
      return res.status(404).json({ message: 'Nenhum jogo encontrado para este usuário' });
    }

    const games = userGames.map(item => item.jogo);

    res.status(200).json({ message: 'Jogos recuperados com sucesso', games });
  } catch (error) {
    console.error('Erro ao buscar jogos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar jogos' });
  }
};

/**
 * Retorna as compras de um usuário por ID com paginação
 */
export const getUserBuys = async (req, res) => {
  const userID = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await db.Buy.findAndCountAll({
      where: { userID },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.ItemJogo,
          as: 'itensCompra',
          include: [
            {
              model: db.Game,
              as: 'jogo',
              attributes: ['id', 'name', 'price']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: 'Compras encontradas com sucesso',
      data: rows,
      total: count,
      page,
      limit
    });
  } catch (error) {
    console.error(`Erro ao buscar compras do usuário ${userID}:`, error);
    res.status(500).json({ message: 'Erro ao buscar compras' });
  }
};
