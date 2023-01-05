'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Region extends Model {
    static associate (models) {
      Region.hasMany(models.House, { foreignKey: 'RegionId' })
      Region.hasMany(models.Section, { foreignKey: 'RegionId' })
    }
  }
  Region.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
