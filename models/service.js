'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate (models) {
    }
  }
  Service.init({
    HouseId: DataTypes.INTEGER,
    FacilityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Service',
    tableName: 'Services',
    underscored: true
  })
  return Service
}
