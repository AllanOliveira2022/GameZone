'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const ItemJogo = sequelize.define('ItemJogo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        buyID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Buys',
                key: 'id',
            },
        },
        gameID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Games',
                key: 'id',
            },
        },
        priceBuy: { // Preço do jogo no momento da compra
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    });

    // Adicionando associações
    ItemJogo.associate = (models) => {
        ItemJogo.belongsTo(models.Buy, { foreignKey: 'buyID', as: 'compra' });
        ItemJogo.belongsTo(models.Game, { foreignKey: 'gameID', as: 'jogo' });
    };

    return ItemJogo;
};
