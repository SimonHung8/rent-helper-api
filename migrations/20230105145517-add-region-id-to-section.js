'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Sections', 'Region_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Regions'
        }
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sections', 'Region_id')
  }
}
