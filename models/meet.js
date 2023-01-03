'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Meet extends Model {
    static associate (models) {
    }
  }
  Meet.init({
    HouseId: DataTypes.INTEGER,
    ConditionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Meet',
    tableName: 'Meets',
    underscored: true
  })
  return Meet
}
