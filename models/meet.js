'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Meet extends Model {
    static associate (models) {
      Meet.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Meet.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    HouseId: DataTypes.INTEGER,
    ConditionId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Meet',
    tableName: 'Meets',
    underscored: true
  })
  return Meet
}
