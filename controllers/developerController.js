import db from '../models/index.js';

// Busca um desenvolvedor pelo ID
export const getDeveloperById = async (req, res) => {
  const { id } = req.params;

  try {
    const developer = await db.Developer.findByPk(id);
    if (!developer) {
      return res.status(404).json({ message: 'Desenvolvedor não encontrado' });
    }
    res.status(200).json({ message: 'Desenvolvedor recuperado com sucesso', developer });
  } catch (error) {
    console.error('Erro ao buscar desenvolvedor por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar desenvolvedor por ID' });
  }
};

// Lista todos os desenvolvedores com paginação
export const listDevelopers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const developers = await db.Developer.findAndCountAll({
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
    });

    res.status(200).json({
      message: 'Desenvolvedores recuperados com sucesso',
      total: developers.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: developers.rows,
    });
  } catch (error) {
    console.error('Erro ao listar desenvolvedores:', error);
    res.status(500).json({ message: 'Erro ao listar desenvolvedores' });
  }
};

// Cria um novo desenvolvedor
export const createDeveloper = async (req, res) => {
  const { name, CNPJ, email, phone } = req.body;

  try {
    // Validação dos dados
    if (!name || !CNPJ || !email || !phone) {
      return res.status(400).json({ message: 'Nome, CNPJ, email e telefone são obrigatórios!' });
    }

    // Cria o desenvolvedor no banco de dados
    const newDeveloper = await db.Developer.create({ name, CNPJ, email, phone });
    res.status(201).json({ message: 'Desenvolvedor criado com sucesso', developer: newDeveloper });
  } catch (error) {
    console.error('Erro ao criar desenvolvedor:', error);
    res.status(500).json({ message: 'Erro ao criar desenvolvedor' });
  }
};

// Atualiza um desenvolvedor existente
export const updateDeveloper = async (req, res) => {
  const { id } = req.params;
  const { name, CNPJ, email, phone } = req.body;

  try {
    // Busca o desenvolvedor pelo ID
    const developerToUpdate = await db.Developer.findByPk(id);
    if (!developerToUpdate) {
      return res.status(404).json({ message: 'Desenvolvedor não encontrado' });
    }

    // Atualiza o desenvolvedor
    developerToUpdate.name = name || developerToUpdate.name;
    developerToUpdate.CNPJ = CNPJ || developerToUpdate.CNPJ;
    developerToUpdate.email = email || developerToUpdate.email;
    developerToUpdate.phone = phone || developerToUpdate.phone;
    await developerToUpdate.save();

    res.status(200).json({ message: 'Desenvolvedor atualizado com sucesso', developer: developerToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar desenvolvedor:', error);
    res.status(500).json({ message: 'Erro ao atualizar desenvolvedor' });
  }
};

// Deleta um desenvolvedor
export const deleteDeveloper = async (req, res) => {
  const { id } = req.params;

  try {
    const developerToDelete = await db.Developer.findByPk(id);
    if (!developerToDelete) {
      return res.status(404).json({ message: 'Desenvolvedor não encontrado' });
    }

    await developerToDelete.destroy();
    res.status(200).json({ message: 'Desenvolvedor deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar desenvolvedor:', error);
    res.status(500).json({ message: 'Erro ao deletar desenvolvedor' });
  }
};