'use strict'
const root = require('../config/root.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const kinds = root.KIND.map(kind => ({
      ...kind,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Kinds', kinds)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Kinds', {})
  }
}
