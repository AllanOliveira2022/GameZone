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
        userID: {  // A chave estrangeira que referencia o usuário
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',  // Referência à tabela Users
                key: 'id',
            },
            allowNull: false,  // Não permite que uma compra não tenha um usuário associado
        }
    });

    Buy.associate = (models) => {
        // Um Buy tem muitos Games, mas agora Buy pertence a um único User
        Buy.hasMany(models.Game, { foreignKey: 'buyID' });

        // Relacionamento: uma compra pertence a um usuário
        Buy.belongsTo(models.User, { foreignKey: 'userID' });
    };

    return Buy;
};
