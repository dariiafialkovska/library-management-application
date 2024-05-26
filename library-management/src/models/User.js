
import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';


// Define the User model
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

export default User;