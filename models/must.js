'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Must extends Model {
    static associate (models) {
      Must.belongsTo(models.User, { foreignKey: 'UserId' })
      Must.belongsToMany(models.House, {
        through: models.Fulfill,
        foreignKey: 'MustId',
        as: 'FulfilledHouses'
      })
    }
  }
  Must.init({
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Must',
    tableName: 'Musts',
    underscored: true
  })
  return Must
}
