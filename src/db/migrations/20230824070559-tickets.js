'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          'open',
          'assigned',
          'scheduled',
          'in_progress',
          'reserved',
          'closed',
        ),
        defaultValue: 'open',
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      scheduled_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      priority: {
        allowNull: false,
        type: Sequelize.ENUM('low', 'high', 'medium', 'critical'),
        defaultValue: 'low',
      },
      feedback: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_by: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_by: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      deleted_by: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tickets');
  },
};
