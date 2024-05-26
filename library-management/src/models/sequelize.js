import { Sequelize } from 'sequelize';


// Setup connection using default 'postgres' user


//Username: postgres
//Password: postgres
//Database: library_management
//Host: localhost
//Dialect: postgres
//Logging: console.log


const sequelize = new Sequelize('library_management', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log  
});

export default sequelize;

