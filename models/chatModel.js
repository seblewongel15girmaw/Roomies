const sequelize = require("../config/dbConfig")
const { DataTypes } = require("sequelize")

const Chat = sequelize.define("Chat", {
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }

})

module.exports= Chat