'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    static associate (models) {
      Region.hasMany(models.House, { foreignKey: 'RegionId' })
    }
  }
  Region.init({
    externalId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Region',
    tableName: 'Regions',
    underscored: true
  })
  return Region
}
