const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require('uuid');


const House = sequelize.define("House", {
  houseId: {
    type: DataTypes.UUID,
    defaultValue: uuidv4(),
    allowNull: false,
    primaryKey: true,
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

})


const Image = sequelize.define('Image', {
  imageId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});



module.exports = { House, Image }