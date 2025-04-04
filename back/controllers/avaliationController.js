import db from '../models/index.js';

// Cria uma nova avaliação
export const createAvaliation = async (req, res) => {
  const { userId, gameId, score, comment } = req.body;

  try {
    // Validação dos dados
    if (!userId || !gameId || !score || !comment) {
      return res.status(400).json({ message: 'userId, gameId, score e comment são obrigatórios' });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Score deve estar entre 1 e 5' });
    }

    // Cria a avaliação no banco de dados
    const newAvaliation = await db.Avaliation.create({ userId, gameId, score, comment });
    res.status(201).json({ message: 'Avaliação criada com sucesso', avaliation: newAvaliation });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ message: 'Erro ao criar avaliação' });
  }
};

// Lista todas as avaliações com os dados dos usuários e jogos relacionados
export const getAllAvaliations = async (req, res) => {
  try {
    const avaliations = await db.Avaliation.findAll({
      include: [
        {
          model: db.User, // Incluir os dados do usuário
          attributes: ['id', 'name'], // Atributos que você quer retornar
        },
        {
          model: db.Game, // Incluir os dados do jogo
          attributes: ['id', 'title'], // Atributos que você quer retornar
        },
      ],
    });
    res.status(200).json({ message: 'Avaliações recuperadas com sucesso', avaliations });
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    res.status(500).json({ message: 'Erro ao listar avaliações' });
  }
};

// Busca uma avaliação pelo ID, incluindo dados do usuário e jogo
export const getAvaliationById = async (req, res) => {
  const { id } = req.params;

  try {
    const avaliation = await db.Avaliation.findByPk(id, {
      include: [
        {
          model: db.User,
          attributes: ['id', 'name'],
        },
        {
          model: db.Game,
          attributes: ['id', 'title'],
        },
      ],
    });
    if (!avaliation) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.status(200).json({ message: 'Avaliação recuperada com sucesso', avaliation });
  } catch (error) {
    console.error('Erro ao buscar avaliação por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar avaliação por ID' });
  }
};

// Busca avaliações por comentário (usando LIKE)
export const getAvaliationsByComment = async (req, res) => {
  const { comment } = req.query;

  if (!comment) {
    return res.status(400).json({ message: 'Parâmetro comment é obrigatório' });
  }

  try {
    const avaliations = await db.Avaliation.findAll({
      where: {
        comment: {
          [db.Sequelize.Op.like]: `%${comment}%`
        }
      },
      include: [
        {
          model: db.User,
          attributes: ['id', 'name'],
        },
        {
          model: db.Game,
          attributes: ['id', 'title'],
        },
      ],
    });
    res.status(200).json({ message: 'Avaliações recuperadas com sucesso', avaliations });
  } catch (error) {
    console.error('Erro ao buscar avaliações por comentário:', error);
    res.status(500).json({ message: 'Erro ao buscar avaliações por comentário' });
  }
};

// Atualiza uma avaliação existente
export const updateAvaliation = async (req, res) => {
  const { id } = req.params;
  const { userId, gameId, score, comment } = req.body;

  try {
    // Validação do score
    if (score && (score < 1 || score > 5)) {
      return res.status(400).json({ message: 'Score deve estar entre 1 e 5' });
    }

    // Busca a avaliação pelo ID
    const avaliation = await db.Avaliation.findByPk(id);
    if (!avaliation) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    // Atualiza a avaliação
    avaliation.userId = userId || avaliation.userId;
    avaliation.gameId = gameId || avaliation.gameId;
    avaliation.score = score || avaliation.score;
    avaliation.comment = comment || avaliation.comment;
    await avaliation.save();

    res.status(200).json({ message: 'Avaliação atualizada com sucesso', avaliation });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ message: 'Erro ao atualizar avaliação' });
  }
};

// Deleta uma avaliação
export const deleteAvaliation = async (req, res) => {
  const { id } = req.params;

  try {
    const avaliation = await db.Avaliation.findByPk(id);
    if (!avaliation) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    await avaliation.destroy();
    res.status(200).json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ message: 'Erro ao deletar avaliação' });
  }
};
