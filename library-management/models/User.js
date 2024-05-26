const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); 
const Borrowing = require('./Borrowing');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true  
});

module.exports = User;
