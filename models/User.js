'use strict';

import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize) => {
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
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: true,
        len: [10, 11]
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true  
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,  // Default 'user' caso não seja informado
    }
  });

  // Hook para criptografar a senha antes de criar ou atualizar o usuário
  User.beforeCreate(async (user, options) => {
    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  User.beforeUpdate(async (user, options) => {
    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  // Relacionamento um-para-muitos: um usuário pode ter várias compras
  User.hasMany(sequelize.models.Buy, { foreignKey: 'userID' });

  return User;
};
