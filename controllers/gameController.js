import db from '../models/index.js';

// Busca um jogo pelo ID
export const getGameById = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await db.Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    res.status(200).json({ message: 'Jogo recuperado com sucesso', game });
  } catch (error) {
    console.error('Erro ao buscar jogo por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar jogo por ID' });
  }
};

// Lista todos os jogos com paginação e filtro por categoria
export const listGames = async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  try {
    const whereClause = {};
    if (category) {
      whereClause.category = category; // Filtra por categoria, se fornecida
    }

    const games = await db.Game.findAndCountAll({
      where: whereClause, // Aplica o filtro de categoria
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
    });

    res.status(200).json({
      message: 'Jogos recuperados com sucesso',
      total: games.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: games.rows,
    });
  } catch (error) {
    console.error('Erro ao listar jogos:', error);
    res.status(500).json({ message: 'Erro ao listar jogos' });
  }
};

// Cria um novo jogo
export const createGame = async (req, res) => {
  const { name, description, price, genreID, platformID, developerID, avaliationID, buyID } = req.body;

  try {
    // Validação dos dados
    if (!name || !description || !price || !genreID || !platformID || !developerID || !avaliationID || !buyID) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Cria o jogo no banco de dados
    const newGame = await db.Game.create({
      name,
      description,
      price,
      genreID,
      platformID,
      developerID,
      avaliationID,
      buyID,
    });

    res.status(201).json({ message: 'Jogo criado com sucesso', game: newGame });
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ message: 'Erro ao criar jogo' });
  }
};

// Atualiza um jogo existente
export const updateGame = async (req, res) => {
  const { id } = req.params;
  const { name, category, price } = req.body;

  try {
    // Busca o jogo pelo ID
    const gameToUpdate = await db.Game.findByPk(id);
    if (!gameToUpdate) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    // Atualiza o jogo
    gameToUpdate.name = name || gameToUpdate.name;
    gameToUpdate.category = category || gameToUpdate.category;
    gameToUpdate.price = price || gameToUpdate.price;
    await gameToUpdate.save();

    res.status(200).json({ message: 'Jogo atualizado com sucesso', game: gameToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({ message: 'Erro ao atualizar jogo' });
  }
};

// Deleta um jogo
export const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const gameToDelete = await db.Game.findByPk(id);
    if (!gameToDelete) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    await gameToDelete.destroy();
    res.status(200).json({ message: 'Jogo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    res.status(500).json({ message: 'Erro ao deletar jogo' });
  }
};