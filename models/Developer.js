'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Developer = sequelize.define('Developer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CNPJ: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [10, 11],
      },
    },
  });

  Developer.associate = (models) => {
    Developer.hasMany(models.Game, { foreignKey: 'developerID' });
  };

  return Developer;
};