'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Shape extends Model {
    static associate (models) {
      Shape.hasMany(models.House, { foreignKey: 'ShapeId' })
    }
  }
  Shape.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    externalId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shape',
    tableName: 'Shapes',
    underscored: true
  })
  return Shape
}
