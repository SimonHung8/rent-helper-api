'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class House extends Model {
    static associate (models) {
      House.hasMany(models.Photo, { foreignKey: 'HouseId ' })
      House.hasMany(models.Expense, { foreignKey: 'HouseId' })
      House.belongsTo(models.User, { foreignKey: 'UserId' })
      House.belongsTo(models.Region, { foreignKey: 'RegionId' })
      House.belongsTo(models.Section, { foreignKey: 'SectionId' })
      House.belongsTo(models.Kind, { foreignKey: 'KindId' })
      House.belongsTo(models.Shape, { foreignKey: 'ShapeId' })
      House.belongsToMany(models.Condition, {
        through: models.Meet,
        foreignKey: 'HouseId',
        as: 'MetConditions'
      })
      House.belongsToMany(models.Facility, {
        through: models.Service,
        foreignKey: 'HouseId',
        as: 'ServicedFacilities'
      })
    }
  }
  House.init({
    UserId: DataTypes.INTEGER,
    externalId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    RegionId: DataTypes.INTEGER,
    SectionId: DataTypes.INTEGER,
    KindId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    ShapeId: DataTypes.INTEGER,
    area: DataTypes.STRING,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'House',
    tableName: 'Houses',
    underscored: true
  })
  return House
}
