'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
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
        createdAt: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        genreID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Genres',
                key: 'id'
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        platformID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Platforms',
                key: 'id'
            },
        },
        developerID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Developers',
                key: 'id'
            },
        }
    });

    // Definir associações
    Game.associate = (models) => {
        Game.belongsTo(models.Genre, { foreignKey: 'genreID' });
        Game.belongsTo(models.Platform, { foreignKey: 'platformID' });
        Game.belongsTo(models.Developer, { foreignKey: 'developerID' });

        // Um jogo pode estar em várias compras através de ItemJogo
        Game.hasMany(models.ItemJogo, { foreignKey: 'gameID', as: 'itensVenda' });

        // Um jogo pode ter várias avaliações
        Game.hasMany(models.Avaliation, { foreignKey: 'gameID' });
    };

    return Game;
};
