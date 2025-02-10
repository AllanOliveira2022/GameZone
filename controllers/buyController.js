import Buy from '../models/buy.js';
import BuyRepository from '../repositories/buyRepository.js';

export const getBuyById = async (req, res) => {
  const { id } = req.params;

  const buy = await BuyRepository.getById(Number(id));

  if (!buy) {
    return res.status(404).json({ error: 'Buy not found' });
  }

  res.json(buy);
};

export const listBuys = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  let buys = await BuyRepository.getAll();

  const start = (page - 1) * limit;
  const paginatedBuys = buys.slice(start, start + parseInt(limit));

  res.json({ total: buys.length, page, limit, data: paginatedBuys });
};

export const createBuy = async (req, res) => {
  const { price, dateBuy } = req.body;

  if (!price || !dateBuy) {
    return res.status(400).json({ error: 'Price and dateBuy are required' });
  }

  const newBuy = new Buy(null, price, dateBuy);
  const addedBuy = await BuyRepository.add(newBuy);

  res.status(201).json(addedBuy);
};

export const updateBuy = async (req, res) => {
  const { id } = req.params;
  const { price, dateBuy } = req.body;

  const buyToUpdate = await BuyRepository.getById(Number(id));

  if (!buyToUpdate) {
    return res.status(404).json({ error: 'Buy not found' });
  }

  const updatedBuy = await BuyRepository.update(id, { price, dateBuy });

  res.json(updatedBuy);
};

export const deleteBuy = async (req, res) => {
  const { id } = req.params;

  const deletedBuy = await BuyRepository.delete(Number(id));

  if (!deletedBuy) {
    return res.status(404).json({ error: 'Buy not found' });
  }

  res.status(204).send();
};
