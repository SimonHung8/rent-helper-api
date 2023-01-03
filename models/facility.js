'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Facility extends Model {
    static associate (models) {
      Facility.belongsToMany(models.House, {
        through: models.Service,
        foreignKey: 'FacilityId',
        as: 'ServicedHouses'
      })
    }
  }
  Facility.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Facility',
    tableName: 'Facilities',
    underscored: true
  })
  return Facility
}
