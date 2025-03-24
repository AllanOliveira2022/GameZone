'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Buys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      dateBuy: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userID: {  // Adicionando a chave estrangeira que referencia o usuário
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Tabela Users
          key: 'id',  // Coluna de referência
        },
        onUpdate: 'CASCADE',  // Mantém a integridade ao atualizar a tabela Users
        onDelete: 'CASCADE',  // Mantém a integridade ao deletar um usuário
      },
      createdAt: { // Timestamps
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: { // Timestamps
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Buys');  // Dropando a tabela Buys
  }
};
