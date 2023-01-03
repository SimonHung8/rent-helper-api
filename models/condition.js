'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Condition extends Model {
    static associate (models) {
      Condition.belongsTo(models.User, { foreignKey: 'UserId' })
      Condition.belongsToMany(models.House, {
        through: models.Meet,
        foreignKey: 'ConditionId',
        as: 'MetHouses'
      })
    }
  }
  Condition.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Condition',
    tableName: 'Conditions',
    underscored: true
  })
  return Condition
}
