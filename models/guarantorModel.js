
const sequelize = require("../config/dbConfig")
const {DataTypes}= require("sequelize")

const Guarantor = sequelize.define("Guarantor", {

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Full name is required." },
      notEmpty: { msg: "Full name cannot be empty." }
    }
    
  },
  personal_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique:true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull:false,
    validate: {
      notNull: { msg: "Address is required." },
      notEmpty: { msg: "Address cannot be empty." }
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull:false,
    unique: {
      msg: "Phone number must be unique."
    },
    validate: {
      notNull: { msg: "Phone number is required." },
      notEmpty: { msg: "Phone number cannot be empty." }
    }
  },
  gender: {
    type: DataTypes.ENUM("female", "male"),
    allowNull:false,
    notNull: { msg: "Gender is required." },
      isIn: {
        args: [["female", "male"]],
        msg: "Gender must be either 'female' or 'male'."
      }
  }
})
  
module.exports = Guarantor;
