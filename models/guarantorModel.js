
const sequelize = require("../config/dbConfig")
const {DataTypes}= require("sequelize")

const Guarantor = sequelize.define("Guarantor", {

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  personal_id: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:""
  },
  address: {
    type: DataTypes.STRING,
    allowNull:false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull:false
  },
  gender: {
    type: DataTypes.ENUM("female", "male"),
    allowNull:false
  }
})
  
module.exports = Guarantor;
