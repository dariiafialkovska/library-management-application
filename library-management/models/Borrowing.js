const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize');
const User = require('./User');
const Book = require('./Book');
const Borrowing = sequelize.define('Borrowing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Books',
            key: 'id'
        }
    },
    score:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    returned:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    timestamps: false
});

module.exports = Borrowing;