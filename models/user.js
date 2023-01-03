'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.House, { foreignKey: 'UserId' })
      User.hasMany(models.Condition, { foreignKey: 'UserId' })
      User.hasMany(models.Expense, { foreignKey: 'UserId' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
