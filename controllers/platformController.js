import db from '../models/index.js';

// Busca uma plataforma pelo ID
export const getPlatformById = async (req, res) => {
  const { id } = req.params;

  try {
    const platform = await db.Platform.findByPk(id);
    if (!platform) {
      return res.status(404).json({ message: 'Plataforma não encontrada' });
    }
    res.status(200).json({ message: 'Plataforma recuperada com sucesso', platform });
  } catch (error) {
    console.error('Erro ao buscar plataforma por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar plataforma por ID' });
  }
};

// Lista todas as plataformas com paginação
export const listPlatforms = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const platforms = await db.Platform.findAndCountAll({
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
    });

    res.status(200).json({
      message: 'Plataformas recuperadas com sucesso',
      total: platforms.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: platforms.rows,
    });
  } catch (error) {
    console.error('Erro ao listar plataformas:', error);
    res.status(500).json({ message: 'Erro ao listar plataformas' });
  }
};

// Cria uma nova plataforma
export const createPlatform = async (req, res) => {
  const { name } = req.body;

  try {
    // Validação dos dados
    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    // Cria a plataforma no banco de dados
    const newPlatform = await db.Platform.create({ name });
    res.status(201).json({ message: 'Plataforma criada com sucesso', platform: newPlatform });
  } catch (error) {
    console.error('Erro ao criar plataforma:', error);
    res.status(500).json({ message: 'Erro ao criar plataforma' });
  }
};

// Atualiza uma plataforma existente
export const updatePlatform = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Busca a plataforma pelo ID
    const platformToUpdate = await db.Platform.findByPk(id);
    if (!platformToUpdate) {
      return res.status(404).json({ message: 'Plataforma não encontrada' });
    }

    // Atualiza a plataforma
    platformToUpdate.name = name || platformToUpdate.name;
    await platformToUpdate.save();

    res.status(200).json({ message: 'Plataforma atualizada com sucesso', platform: platformToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar plataforma:', error);
    res.status(500).json({ message: 'Erro ao atualizar plataforma' });
  }
};

// Deleta uma plataforma
export const deletePlatform = async (req, res) => {
  const { id } = req.params;

  try {
    const platformToDelete = await db.Platform.findByPk(id);
    if (!platformToDelete) {
      return res.status(404).json({ message: 'Plataforma não encontrada' });
    }

    await platformToDelete.destroy();
    res.status(200).json({ message: 'Plataforma deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar plataforma:', error);
    res.status(500).json({ message: 'Erro ao deletar plataforma' });
  }
};