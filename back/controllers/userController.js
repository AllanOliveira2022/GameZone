import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
import db from '../models/index.js';

export const getUserGames = async (req, res) => {
  const userID = req.user?.id; // Pegando o ID do usuário da rota

  try {
    const userGames = await db.ItemJogo.findAll({
      include: [
        {
          model: db.Buy,
          as: 'compra', // Verifique se esse é o alias correto definido no Model
          where: { userID }, // Filtrando pelo usuário dono da compra
          attributes: [], // Não precisamos dos dados da compra
        },
        {
          model: db.Game,
          as: 'jogo', // Verifique o alias definido no Model
          attributes: ['id', 'name', 'price', 'description'],
        },
      ],
      attributes: [], // Não queremos os dados da tabela intermediária
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
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido', token, role: user.role });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

export const signUp = async (req, res) => {
  const { name, email, dateBirth, phone, address, password, role = 'user' } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com esse Email!' });
    }
    const existingUserTel = await db.User.findOne({ where: { phone } });
    if (existingUserTel) {
      return res.status(400).json({ message: 'Já existe um usuário com esse Telefone!' });
    }

    const newUser = await db.User.create({ 
      name, 
      email, 
      dateBirth, 
      phone, 
      address, 
      password, 
      role 
    });

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
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] } // Removendo apenas a senha da resposta
    });

    res.status(200).json({ message: 'Lista de usuários recuperada com sucesso', users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};
