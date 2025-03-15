import db from '../models/index.js';

// Busca um usuário pelo ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário recuperado com sucesso', user });
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário por ID' });
  }
};

// Lista todos os usuários com paginação
export const listUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await db.User.findAndCountAll({
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
    });

    res.status(200).json({
      message: 'Usuários recuperados com sucesso',
      total: users.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: users.rows,
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

// Cria um novo usuário
export const createUser = async (req, res) => {
  const { name, dateBirth, email, phone, address, buyID, password } = req.body;

  try {
    // Validação dos dados
    if (!name || !dateBirth || !email || !phone || !address || !buyID || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verifica se o usuário já existe
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { phone }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou telefone já cadastrado' });
    }

    // Cria o usuário no banco de dados
    const newUser = await db.User.create({ name, dateBirth, email, phone, address, buyID, password });
    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// Atualiza um usuário existente
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, dateBirth, email, phone, address, buyID, password } = req.body;

  try {
    // Busca o usuário pelo ID
    const userToUpdate = await db.User.findByPk(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza o usuário
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.dateBirth = dateBirth || userToUpdate.dateBirth;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.phone = phone || userToUpdate.phone;
    userToUpdate.address = address || userToUpdate.address;
    userToUpdate.buyID = buyID || userToUpdate.buyID;
    userToUpdate.password = password || userToUpdate.password;
    await userToUpdate.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user: userToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Deleta um usuário
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToDelete = await db.User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await userToDelete.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

// Login do usuário
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso', user });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};