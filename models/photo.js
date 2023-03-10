'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate (models) {
      Photo.belongsTo(models.House, { foreignKey: 'HouseId' })
    }
  }
  Photo.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    HouseId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    isCover: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'Photos',
    underscored: true
  })
  return Photo
}
