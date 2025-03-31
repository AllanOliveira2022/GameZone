import db from '../models/index.js';

// Busca uma compra pelo ID com itens
export const getBuyById = async (req, res) => {
  const { id } = req.params;
  const userID = req.user?.id; // Obtendo o ID do usuário autenticado

  try {
    // Busca a compra pelo ID e inclui o comprador
    const buy = await db.Buy.findByPk(id, {
      include: [
        { 
          model: db.User, 
          as: 'comprador',
          attributes: ['id'] // Inclui apenas o ID do comprador para verificação
        },
        { 
          model: db.ItemJogo, 
          as: 'itensCompra',
          include: [
            { 
              model: db.Game, 
              as: 'jogo',
              include: [
                { model: db.Genre },
                { model: db.Platform },
                { model: db.Developer }
              ]
            }
          ]
        }
      ]
    });

    if (!buy) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    // Verifica se o usuário autenticado é o comprador
    if (buy.comprador.id !== userID) {
      return res.status(403).json({ message: 'Acesso negado: você só pode visualizar suas próprias compras' });
    }

    res.status(200).json({ message: 'Compra recuperada com sucesso', buy });
  } catch (error) {
    console.error('Erro ao buscar compra por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar compra por ID' });
  }
};



// Lista todas as compras com paginação e relacionamentos
export const listBuys = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const buys = await db.Buy.findAndCountAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [
        { 
          model: db.ItemJogo, 
          as: 'itensCompra',
          include: [{ model: db.Game, as: 'jogo' }]
        },
        { 
          model: db.User, 
          as: 'comprador' 
        }
      ]
    });

    res.status(200).json({
      message: 'Compras recuperadas com sucesso',
      total: buys.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: buys.rows,
    });
  } catch (error) {
    console.error('Erro ao listar compras:', error);
    res.status(500).json({ message: 'Erro ao listar compras' });
  }
};

// Cria uma nova compra com seus itens
export const createBuy = async (req, res) => {
  const { userID, dateBuy, items } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    // Validação dos dados
    if (!userID || !dateBuy || !items || items.length === 0) {
      return res.status(400).json({ message: 'Dados da compra incompletos' });
    }

    // Obter todos os IDs dos jogos fornecidos
    const gameIDs = items.map(item => item.gameID);

    // Buscar os jogos no banco de dados
    const existingGames = await db.Game.findAll({
      where: { id: gameIDs }
    });

    // Criar um conjunto de IDs de jogos existentes
    const existingGameIDs = new Set(existingGames.map(game => game.id));

    // Verificar se todos os jogos existem
    const invalidGames = gameIDs.filter(id => !existingGameIDs.has(id));

    if (invalidGames.length > 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Alguns jogos não estão cadastrados no banco', 
        invalidGames 
      });
    }

    // Calcular preço total
    const totalPrice = items.reduce((total, item) => total + parseFloat(item.priceBuy), 0);

    // Criar a compra no banco de dados
    const newBuy = await db.Buy.create({ 
      userID, 
      dateBuy, 
      price: totalPrice 
    }, { transaction });

    // Criar os itens da compra
    const buyItems = items.map(item => ({
      buyID: newBuy.id,
      gameID: item.gameID,
      priceBuy: item.priceBuy
    }));

    await db.ItemJogo.bulkCreate(buyItems, { transaction });

    await transaction.commit();

    // Buscar a compra completa para retornar
    const completeBuy = await db.Buy.findByPk(newBuy.id, {
      include: [
        { 
          model: db.ItemJogo, 
          as: 'itensCompra',
          include: [{ model: db.Game, as: 'jogo' }]
        }
      ]
    });

    res.status(201).json({ 
      message: 'Compra criada com sucesso', 
      buy: completeBuy 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar compra:', error);
    res.status(500).json({ message: 'Erro ao criar compra' });
  }
};


// Atualiza uma compra existente
export const updateBuy = async (req, res) => {
  const { id } = req.params;
  const { dateBuy, items } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    // Busca a compra pelo ID
    const buyToUpdate = await db.Buy.findByPk(id);
    if (!buyToUpdate) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    // Atualiza a data da compra
    buyToUpdate.dateBuy = dateBuy || buyToUpdate.dateBuy;

    // Atualiza o preço total
    if (items && items.length > 0) {
      const totalPrice = items.reduce((total, item) => total + parseFloat(item.priceBuy), 0);
      buyToUpdate.price = totalPrice;
    }

    await buyToUpdate.save({ transaction });

    // Se novos itens forem fornecidos, atualiza os itens da compra
    if (items && items.length > 0) {
      // Remove itens antigos
      await db.ItemJogo.destroy({
        where: { buyID: id },
        transaction
      });

      // Cria novos itens
      const buyItems = items.map(item => ({
        buyID: id,
        gameID: item.gameID,
        priceBuy: item.priceBuy
      }));

      await db.ItemJogo.bulkCreate(buyItems, { transaction });
    }

    await transaction.commit();

    // Busca a compra atualizada
    const updatedBuy = await db.Buy.findByPk(id, {
      include: [
        { 
          model: db.ItemJogo, 
          as: 'itensCompra',
          include: [{ model: db.Game, as: 'jogo' }]
        }
      ]
    });

    res.status(200).json({ 
      message: 'Compra atualizada com sucesso', 
      buy: updatedBuy 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar compra:', error);
    res.status(500).json({ message: 'Erro ao atualizar compra' });
  }
};

// Deleta uma compra
export const deleteBuy = async (req, res) => {
  const { id } = req.params;
  const transaction = await db.sequelize.transaction();

  try {
    const buyToDelete = await db.Buy.findByPk(id);
    if (!buyToDelete) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    // Primeiro deleta os itens da compra
    await db.ItemJogo.destroy({
      where: { buyID: id },
      transaction
    });

    // Depois deleta a compra
    await buyToDelete.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({ message: 'Compra deletada com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao deletar compra:', error);
    res.status(500).json({ message: 'Erro ao deletar compra' });
  }
};

export default {
  getBuyById,
  listBuys,
  createBuy,
  updateBuy,
  deleteBuy
};