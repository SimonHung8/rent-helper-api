'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Avoid extends Model {
    static associate (models) {
    }
  }
  Avoid.init({
    HouseId: DataTypes.INTEGER,
    MustnotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Avoid',
    tableName: 'Avoids',
    underscored: true
  })
  return Avoid
}
