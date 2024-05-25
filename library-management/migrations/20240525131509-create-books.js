'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Books', 'isAvailable', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    });
},

down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Books', 'isAvailable');
}
};
