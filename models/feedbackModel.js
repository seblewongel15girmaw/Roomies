const sequelize = require("../config/dbConfig");
const { DataTypes } = require("sequelize");

const Feedback = sequelize.define("Feedback", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  feedback_message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feedback_category: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Feedback;