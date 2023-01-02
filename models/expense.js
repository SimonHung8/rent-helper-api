'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate (models) {
      Expense.belongsTo(models.House, { foreignKey: 'HouseId' })
      Expense.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Expense.init({
    HouseId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'Expenses',
    underscored: true
  })
  return Expense
}
