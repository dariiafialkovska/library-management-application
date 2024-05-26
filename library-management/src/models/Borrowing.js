import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

// Define the Borrowing model
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

export default Borrowing;