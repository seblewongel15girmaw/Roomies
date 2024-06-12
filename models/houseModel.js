
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const House = sequelize.define("House", {
  houseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numberOfRoom: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  },
  rental_status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

})


const Image = sequelize.define('Image', {
  imageId: {
   
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



module.exports = { House, Image }