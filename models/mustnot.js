'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Mustnot extends Model {
    static associate (models) {
      Mustnot.belongsTo(models.User, { foreignKey: 'UserId' })
      Mustnot.belongsToMany(models.House, {
        through: models.Avoid,
        foreignKey: 'MustnotId',
        as: 'AvoidedHouses'
      })
    }
  }
  Mustnot.init({
    UserId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mustnot',
    tableName: 'Mustnots',
    underscored: true
  })
  return Mustnot
}
