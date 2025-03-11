import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
import db from '../models/index.js';

// Função para login
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

// Função para cadastro de usuário
export const signUp = async (req, res) => {
  const { name, email, dateBirth, phone, address, password, role = 'user' } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const newUser = await db.User.create({ 
      name, 
      email, 
      dateBirth, 
      phone, 
      address, 
      password, 
      role // Agora permite definir o papel do usuário ao criar
    });

    const user = newUser.get({ plain: true });
    delete user.password;

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// Função para listar todos os usuários
export const listUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'address', 'role'] // Agora inclui o role na resposta
    });

    res.status(200).json({ message: 'Lista de usuários recuperada com sucesso', users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};
