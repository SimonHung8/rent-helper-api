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
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
