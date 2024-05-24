const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize');

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
},{
    timestamps: false
});

module.exports = Borrowing;