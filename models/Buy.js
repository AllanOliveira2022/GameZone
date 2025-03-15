'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Buy = sequelize.define('Buy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Corrigido aqui
      allowNull: false,
    },
    dateBuy: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Buy.associate = (models) => {
    // Todas as associações em um único bloco
    Buy.hasMany(models.Game, { foreignKey: 'buyID' });
    Buy.hasMany(models.User, { foreignKey: 'buyID' });
  };

  return Buy;
};