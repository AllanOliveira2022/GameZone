'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Buy = sequelize.define('Buy', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        dateBuy: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userID: {  
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',  
                key: 'id',
            },
            allowNull: false,  
        }
    });

    Buy.associate = (models) => {
        // Corrigir a relação: Buy tem muitos ItemJogo, não Games diretamente
        Buy.hasMany(models.ItemJogo, { foreignKey: 'buyID', as: 'itensCompra' });

        // Relacionamento: uma compra pertence a um usuário
        Buy.belongsTo(models.User, { foreignKey: 'userID', as: 'comprador' });
    };

    return Buy;
};
