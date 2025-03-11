'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Games', { // Plural name for the table
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
      createdAt: { // Should be DATE, not DATEONLY if you want timestamps
        type: Sequelize.DATE,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      avaliationID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Avaliation', // Plural table name
          key: 'id'
        },
        onUpdate: 'CASCADE', // Important for data integrity
        onDelete: 'CASCADE'  // Important for data integrity
      },
      genreID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Genres', // Plural table name
          key: 'id'
        },
        onUpdate: 'CASCADE', // Important for data integrity
        onDelete: 'CASCADE'  // Important for data integrity
      },
      price: {
        type: Sequelize.DECIMAL(10, 2), // Correct syntax for DECIMAL
        allowNull: false
      },
      platformID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Platforms', // Plural table name
          key: 'id'
        },
        onUpdate: 'CASCADE', // Important for data integrity
        onDelete: 'CASCADE'  // Important for data integrity
      },
      developerID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Developers', // Plural table name
          key: 'id'
        },
        onUpdate: 'CASCADE', // Important for data integrity
        onDelete: 'CASCADE'  // Important for data integrity
      },
      buyID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Buys', // Plural table name
          key: 'id'
        },
        onUpdate: 'CASCADE', // Important for data integrity
        onDelete: 'CASCADE'  // Important for data integrity
      },
      updatedAt: { // Timestamp
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Games'); // Plural table name
  }
};