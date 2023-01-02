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
