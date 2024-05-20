const sequelize = require("../config/dbConfig");
const { DataTypes } = require("sequelize");
const User = require("../models/userModel")

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
// Define the association
Feedback.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Feedback;