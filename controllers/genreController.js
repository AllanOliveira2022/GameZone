import db from '../models/index.js';

// Busca um gênero pelo ID
export const getGenreById = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await db.Genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ message: 'Gênero não encontrado' });
    }
    res.status(200).json({ message: 'Gênero recuperado com sucesso', genre });
  } catch (error) {
    console.error('Erro ao buscar gênero por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar gênero por ID' });
  }
};

// Lista todos os gêneros com paginação
export const listGenres = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const genres = await db.Genre.findAndCountAll({
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
    });

    res.status(200).json({
      message: 'Gêneros recuperados com sucesso',
      total: genres.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: genres.rows,
    });
  } catch (error) {
    console.error('Erro ao listar gêneros:', error);
    res.status(500).json({ message: 'Erro ao listar gêneros' });
  }
};

// Cria um novo gênero
export const createGenre = async (req, res) => {
  const { name } = req.body;

  try {
    // Validação dos dados
    if (!name) {
      return res.status(400).json({ message: 'Nome é obrigatório' });
    }

    // Verifica se o gênero já existe
    const existingGenre = await db.Genre.findOne({ where: { name } });
    if (existingGenre) {
      return res.status(400).json({ message: 'Gênero já existe' });
    }

    // Cria o gênero no banco de dados
    const newGenre = await db.Genre.create({ name });
    res.status(201).json({ message: 'Gênero criado com sucesso', genre: newGenre });
  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    res.status(500).json({ message: 'Erro ao criar gênero' });
  }
};

// Atualiza um gênero existente
export const updateGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Busca o gênero pelo ID
    const genreToUpdate = await db.Genre.findByPk(id);
    if (!genreToUpdate) {
      return res.status(404).json({ message: 'Gênero não encontrado' });
    }

    // Atualiza o gênero
    genreToUpdate.name = name || genreToUpdate.name;
    await genreToUpdate.save();

    res.status(200).json({ message: 'Gênero atualizado com sucesso', genre: genreToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar gênero:', error);
    res.status(500).json({ message: 'Erro ao atualizar gênero' });
  }
};

// Deleta um gênero
export const deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const genreToDelete = await db.Genre.findByPk(id);
    if (!genreToDelete) {
      return res.status(404).json({ message: 'Gênero não encontrado' });
    }

    await genreToDelete.destroy();
    res.status(200).json({ message: 'Gênero deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar gênero:', error);
    res.status(500).json({ message: 'Erro ao deletar gênero' });
  }
};