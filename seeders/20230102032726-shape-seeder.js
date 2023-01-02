'use strict'
const root = require('../config/root.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const shapes = root.SHAPE.map(shape => ({
      ...shape,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Shapes', shapes)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shapes', {})
  }
}
