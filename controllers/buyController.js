import db from '../models/index.js';

// Busca uma compra pelo ID
export const getBuyById = async (req, res) => {
  const { id } = req.params;

  try {
    const buy = await db.Buy.findByPk(id);
    if (!buy) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }
    res.status(200).json({ message: 'Compra recuperada com sucesso', buy });
  } catch (error) {
    console.error('Erro ao buscar compra por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar compra por ID' });
  }
};

// Lista todas as compras com paginação
export const listBuys = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const buys = await db.Buy.findAndCountAll({
      offset: (page - 1) * limit, // Calcula o offset para paginação
      limit: parseInt(limit), // Define o limite de resultados por página
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

// Cria uma nova compra
export const createBuy = async (req, res) => {
  const { price, dateBuy } = req.body;

  try {
    // Validação dos dados
    if (!price || !dateBuy) {
      return res.status(400).json({ message: 'Price e dateBuy são obrigatórios' });
    }

    // Cria a compra no banco de dados
    const newBuy = await db.Buy.create({ price, dateBuy });
    res.status(201).json({ message: 'Compra criada com sucesso', buy: newBuy });
  } catch (error) {
    console.error('Erro ao criar compra:', error);
    res.status(500).json({ message: 'Erro ao criar compra' });
  }
};

// Atualiza uma compra existente
export const updateBuy = async (req, res) => {
  const { id } = req.params;
  const { price, dateBuy } = req.body;

  try {
    // Busca a compra pelo ID
    const buyToUpdate = await db.Buy.findByPk(id);
    if (!buyToUpdate) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    // Atualiza a compra
    buyToUpdate.price = price || buyToUpdate.price;
    buyToUpdate.dateBuy = dateBuy || buyToUpdate.dateBuy;
    await buyToUpdate.save();

    res.status(200).json({ message: 'Compra atualizada com sucesso', buy: buyToUpdate });
  } catch (error) {
    console.error('Erro ao atualizar compra:', error);
    res.status(500).json({ message: 'Erro ao atualizar compra' });
  }
};

// Deleta uma compra
export const deleteBuy = async (req, res) => {
  const { id } = req.params;

  try {
    const buyToDelete = await db.Buy.findByPk(id);
    if (!buyToDelete) {
      return res.status(404).json({ message: 'Compra não encontrada' });
    }

    await buyToDelete.destroy();
    res.status(200).json({ message: 'Compra deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar compra:', error);
    res.status(500).json({ message: 'Erro ao deletar compra' });
  }
};