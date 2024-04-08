const sequelize = require("../config/dbConfig")
const { DataTypes } = require("sequelize")

const Chat = sequelize.define("Chat", {
  chat_id: {
    type: DataTypes.INTEGER,
    unique:true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull:false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull:false
  },
  timestamp: {
    type:DataTypes.DATE,
  }

})

module.exports= Chat