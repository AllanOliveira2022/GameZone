'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Buy',
        key: 'id',
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8,
        isAlphanumeric: true,
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Buy, { foreignKey: 'buyID' });
  };

  return User;
};