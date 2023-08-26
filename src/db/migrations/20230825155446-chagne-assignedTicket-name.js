'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('AssignedTickets', 'StaffsTickets');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('StaffsTickets', 'AssignedTickets');
  },
};
