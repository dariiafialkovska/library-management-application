const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); 

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    timestamps: true  
});

module.exports = Book;
