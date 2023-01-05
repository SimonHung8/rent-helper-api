'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate (models) {
      Section.hasMany(models.House, { foreignKey: 'SectionId' })
      Section.belongsTo(models.Region, { foreignKey: 'RegionId' })
    }
  }
  Section.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    externalId: DataTypes.INTEGER,
    RegionId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Section',
    tableName: 'Sections',
    underscored: true
  })
  return Section
}
