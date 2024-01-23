'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      restaurant.belongsTo(models.users)
    }
  }
  restaurant.init({
    name: DataTypes.STRING,
    name_en: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    phone: {
      type: DataTypes.STRING
    },
    google_map: {
      type: DataTypes.STRING
    },
    rating: {
      type: DataTypes.FLOAT
    },
    description: {
      type: DataTypes.TEXT
    },
    userID:{
      type:DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'restaurant'
  })
  return restaurant
}
