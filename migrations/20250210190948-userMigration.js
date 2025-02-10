'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Nome da tabela no plural
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      buyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Buys', // Nome da tabela referenciada no plural
          key: 'id'
        },
        onUpdate: 'CASCADE', // Adicionei onUpdate e onDelete para garantir a integridade referencial
        onDelete: 'CASCADE'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: { // Timestamps
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { // Timestamps
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users'); // Nome da tabela no plural
  }
};