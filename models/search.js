'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Search extends Model {
    static associate (models) {
      Search.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Search.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    keyword: DataTypes.STRING,
    region: DataTypes.INTEGER,
    sections: DataTypes.STRING,
    kind: DataTypes.INTEGER,
    shape: DataTypes.INTEGER,
    minPrice: DataTypes.INTEGER,
    maxPrice: DataTypes.INTEGER,
    minArea: DataTypes.INTEGER,
    maxArea: DataTypes.INTEGER,
    notCover: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Search',
    tableName: 'Searches',
    underscored: true
  })
  return Search
}
