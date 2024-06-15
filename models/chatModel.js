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
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Message is required'
      },
      notEmpty: {
         msg: "Message cannot be empty." 
        },
 
      len: {
        args: [1, 400], // Minimum and maximum length of message
        msg: 'Message must be between 1 and 400 characters'
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }

})

module.exports= Chat