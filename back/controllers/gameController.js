import db from '../models/index.js';

// Busca um jogo pelo ID com relacionamentos
export const getGameById = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await db.Game.findByPk(id, {
      include: [
        { model: db.Genre },
        { model: db.Platform },
        { model: db.Developer },
        { 
          model: db.Avaliation, 
          include: [{ model: db.User }] 
        },
        { 
          model: db.ItemJogo, 
          as: 'itensVenda',
          include: [{ 
            model: db.Buy, 
            as: 'compra',
            include: [{ model: db.User, as: 'comprador' }]
          }]
        }
      ]
    });

    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    res.status(200).json({ message: 'Jogo recuperado com sucesso', game });
  } catch (error) {
    console.error('Erro ao buscar jogo por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar jogo por ID' });
  }
};

// Lista todos os jogos com paginação e filtros
export const listGames = async (req, res) => {
  const { 
    genreID, 
    platformID, 
    developerID, 
    minPrice, 
    maxPrice, 
    page = 1, 
    limit = 10 
  } = req.query;

  try {
    const whereClause = {};
    
    // Filtros
    if (genreID) whereClause.genreID = genreID;
    if (platformID) whereClause.platformID = platformID;
    if (developerID) whereClause.developerID = developerID;
    
    // Filtro de preço
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[db.Sequelize.Op.gte] = minPrice;
      if (maxPrice) whereClause.price[db.Sequelize.Op.lte] = maxPrice;
    }

    const games = await db.Game.findAndCountAll({
      where: whereClause,
      include: [
        { model: db.Genre },
        { model: db.Platform },
        { model: db.Developer }
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
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
  const { 
    name, 
    description, 
    price, 
    genreID, 
    platformID, 
    developerID,
    createdAt
  } = req.body;

  try {
    // Validação dos dados
    if (!name || !description || !price || !genreID || !platformID || !developerID || !createdAt) {
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
      createdAt
    });

    // Busca o jogo completo com relacionamentos
    const createdGame = await db.Game.findByPk(newGame.id, {
      include: [
        { model: db.Genre },
        { model: db.Platform },
        { model: db.Developer }
      ]
    });

    res.status(201).json({ 
      message: 'Jogo criado com sucesso', 
      game: createdGame 
    });
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ message: 'Erro ao criar jogo' });
  }
};

// Atualiza um jogo existente
export const updateGame = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    description, 
    price, 
    genreID, 
    platformID, 
    developerID 
  } = req.body;

  try {
    // Busca o jogo pelo ID
    const gameToUpdate = await db.Game.findByPk(id);
    if (!gameToUpdate) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    // Atualiza o jogo
    gameToUpdate.name = name || gameToUpdate.name;
    gameToUpdate.description = description || gameToUpdate.description;
    gameToUpdate.price = price || gameToUpdate.price;
    gameToUpdate.genreID = genreID || gameToUpdate.genreID;
    gameToUpdate.platformID = platformID || gameToUpdate.platformID;
    gameToUpdate.developerID = developerID || gameToUpdate.developerID;

    await gameToUpdate.save();

    // Busca o jogo atualizado com relacionamentos
    const updatedGame = await db.Game.findByPk(id, {
      include: [
        { model: db.Genre },
        { model: db.Platform },
        { model: db.Developer }
      ]
    });

    res.status(200).json({ 
      message: 'Jogo atualizado com sucesso', 
      game: updatedGame 
    });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    res.status(500).json({ message: 'Erro ao atualizar jogo' });
  }
};

// Deleta um jogo
export const deleteGame = async (req, res) => {
  const { id } = req.params;
  const transaction = await db.sequelize.transaction();

  try {
    const gameToDelete = await db.Game.findByPk(id);
    if (!gameToDelete) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    // Primeiro deleta os itens de compra relacionados
    await db.ItemJogo.destroy({
      where: { gameID: id },
      transaction
    });

    // Deleta as avaliações relacionadas
    await db.Avaliation.destroy({
      where: { gameID: id },
      transaction
    });

    // Depois deleta o jogo
    await gameToDelete.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({ message: 'Jogo deletado com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao deletar jogo:', error);
    res.status(500).json({ message: 'Erro ao deletar jogo' });
  }
};

export default {
  getGameById,
  listGames,
  createGame,
  updateGame,
  deleteGame
};