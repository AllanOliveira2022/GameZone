// middleware/userMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware para autenticar o token JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Verifica o token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = user;  // Armazena as informações do usuário no request
    next();  // Passa para o próximo middleware ou rota
  });
};

// Middleware para verificar se o usuário está tentando acessar seus próprios dados
export const authorizeUser = (req, res, next) => {
  // Verifica se o usuário autenticado está tentando acessar seu próprio recurso
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ message: 'Você não tem permissão para acessar esse recurso' });
  }
  next();
};

// Middleware para autorizar um papel específico, como administrador
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};
