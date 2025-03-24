'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Avaliation = sequelize.define('Avaliation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Certifique-se de que o nome do modelo de usuário está correto
                key: 'id'
            }
        },
        gameId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Games', // Certifique-se de que o nome do modelo de jogo está correto
                key: 'id'
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Avaliation.associate = (models) => {
        Avaliation.belongsTo(models.User, { foreignKey: 'userId' });
        Avaliation.belongsTo(models.Game, { foreignKey: 'gameId' });
    };

    return Avaliation;
};
