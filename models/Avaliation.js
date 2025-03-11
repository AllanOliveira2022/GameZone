'use strict';

import { DataTypes } from 'sequelize';

export default (sequelize) => {

    const Avaliation = sequelize.define('Avaliation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        Avaliation.hasMany(models.Game, { foreignKey: 'avaliationID' });
    }

    return Avaliation;
}
