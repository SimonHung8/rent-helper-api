'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Searches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      User_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users'
          }
        }
      },
      keyword: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.INTEGER
      },
      sections: {
        type: Sequelize.STRING
      },
      kind: {
        type: Sequelize.INTEGER
      },
      shape: {
        type: Sequelize.INTEGER
      },
      min_price: {
        type: Sequelize.INTEGER
      },
      max_price: {
        type: Sequelize.INTEGER
      },
      min_area: {
        type: Sequelize.INTEGER
      },
      max_area: {
        type: Sequelize.INTEGER
      },
      not_cover: {
        type: Sequelize.BOOLEAN
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Searches')
  }
}
