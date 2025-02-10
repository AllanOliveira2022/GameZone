'use strict';

const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {

    const Platform = sequelize.define('Platform', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Platform.associate = (models) => {
        Platform.hasMany(models.Game, { foreignKey: 'PlatformID' });
    }

    return Platform;
}