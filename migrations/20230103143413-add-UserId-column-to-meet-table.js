'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Meets', 'User_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Users'
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Meets', 'User_id')
  }
}
