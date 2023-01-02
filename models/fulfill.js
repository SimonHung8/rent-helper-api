'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Fulfill extends Model {
    static associate (models) {
    }
  }
  Fulfill.init({
    HouseId: DataTypes.INTEGER,
    MustId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Fulfill',
    tableName: 'Fulfills',
    underscored: true
  })
  return Fulfill
}
