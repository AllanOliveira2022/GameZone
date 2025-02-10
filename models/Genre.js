'use strict';

const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

    const Genre = sequelize.define('Genre', {
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

    Genre.associate = (models) => {
        Genre.hasMany(models.Game, { foreignKey: 'genreID' });
    }

    return Genre;
}