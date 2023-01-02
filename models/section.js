'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate (models) {
      Section.hasMany(models.House, { foreignKey: 'SectionId' })
    }
  }
  Section.init({
    externalId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Section',
    tableName: 'Sections',
    underscored: true
  })
  return Section
}
