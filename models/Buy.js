'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    const Buy= sequelize.define('Buy', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        dateBuy:{
            type: DataTypes.DATE,
            allowNull: false,
        }


    });

    Buy.associate = (models) => {
        Buy.hasMany(models.Game, { foreignKey: 'buyID' });
    }
    Buy.associate = (models) => {
        Buy.hasMany(models.User, { foreignKey: 'buyID' });
    }

    return Buy;
}