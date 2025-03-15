'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    avaliationID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Avaliation',
        key: 'id',
      },
    },
    genreID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genre',
        key: 'id',
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Corrigido aqui
      allowNull: false,
    },
    platformID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Platform',
        key: 'id',
      },
    },
    developerID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Developer',
        key: 'id',
      },
    },
    buyID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Buy',
        key: 'id',
      },
    },
  });

  Game.associate = (models) => {
    // Todas as associações em um único bloco
    Game.belongsTo(models.Genre, { foreignKey: 'genreID' });
    Game.belongsTo(models.Avaliation, { foreignKey: 'avaliationID' });
    Game.belongsTo(models.Platform, { foreignKey: 'platformID' }); // Corrigido aqui
    Game.belongsTo(models.Developer, { foreignKey: 'developerID' });
    Game.belongsTo(models.Buy, { foreignKey: 'buyID' });
  };

  return Game;
};