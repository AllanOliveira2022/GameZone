'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {

    const Game = sequelize.define('Game', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt:{
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        description:{
          type: DataTypes.TEXT,
          allowNull: false,
        },
        avaliationID:{
          type: DataTypes.INTEGER,
          references: {
            model: 'Avaliation',
            key: 'id'
          },
        },
        genreID:{
          type: DataTypes.INTEGER,
          references: {
            model: 'Genre',
            key: 'id'
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        platformID:{
          type: DataTypes.INTEGER,
          references: {
            model: 'Platform',
            key: 'id'
          },
        },
        developerID:{
          type: DataTypes.INTEGER,
          references: {
            model: 'Developer',
            key: 'id'
          },
        },
        buyID:{
          type: DataTypes.INTEGER,
          references: {
            model: 'Buy',
            key: 'id'
          },
        }

    });

    Game.associate = (models) => {
      Game.belongsTo(models.Genre, { foreignKey: 'genreID'});
    }
    Game.associate = (models) => {
      Game.belongsTo(models.Avaliation, { foreignKey: 'avaliationID'});
    }
    Game.associate = (models) => {
      Game.belongsTo(models.Plataform, { foreignKey: 'platformID'});
    }
    Game.associate = (models) => {
      Game.belongsTo(models.Developer, { foreignKey: 'developerID'});
    }
    Game.associate = (models) => {
      Game.belongsTo(models.Buy, { foreignKey: 'buyID'});
    }

    return Game;
};