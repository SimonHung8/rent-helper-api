'use strict'
const root = require('../config/root.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const sections = root.SECTION.map(section => ({
      ...section,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Sections', sections)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sections', {})
  }
}
