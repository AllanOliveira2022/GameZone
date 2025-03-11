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
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: { // Adicionando role ao modelo
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user', // Default 'user' caso não seja informado
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
