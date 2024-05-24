const { Sequelize } = require('sequelize');

// Setup connection using default 'postgres' user
const sequelize = new Sequelize('library_management', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log  // Enable logging; useful for development
});

module.exports = sequelize;


