'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate (models) {
      Expense.belongsTo(models.House, { foreignKey: 'HouseId' })
    }
  }
  Expense.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    HouseId: DataTypes.INTEGER,
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
