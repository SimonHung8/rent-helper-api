'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Kind extends Model {
    static associate (models) {
      Kind.hasMany(models.House, { foreignKey: 'KindId' })
    }
  }
  Kind.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    externalId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kind',
    tableName: 'Kinds',
    underscored: true
  })
  return Kind
}
