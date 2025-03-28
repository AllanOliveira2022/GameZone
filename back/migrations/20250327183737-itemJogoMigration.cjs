'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemJogos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      buyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Buys',
          key: 'id',
        },
        onDelete: 'CASCADE', // Caso a compra seja deletada, os itens também serão deletados
      },
      gameID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Games',
          key: 'id',
        },
        onDelete: 'CASCADE', // Caso o jogo seja deletado, os itens também serão deletados
      },
      priceBuy: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Definindo a data de criação automaticamente
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Definindo a data de atualização automaticamente
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ItemJogos');
  }
};
