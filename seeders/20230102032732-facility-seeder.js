'use strict'
const root = require('../config/root.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const facilities = root.FACILITY.map(facility => ({
      ...facility,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Facilities', facilities)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Facilities', {})
  }
}
