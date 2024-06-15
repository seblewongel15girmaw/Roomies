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
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Rating is required'
      },
      notEmpty: {
        msg: 'Rating must not be empty'
      },
      isInt: {
        msg: 'Rating must be an integer'
      },
      min: {
        args: [1], // Minimum value allowed for rating
        msg: 'Rating must be at least 1'
      },
      max: {
        args: [5], // Maximum value allowed for rating
        msg: 'Rating must be at most 5'
      }
    }
  },
  feedback_message: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Feedback message is required'
      },
      notEmpty: {
        msg: 'Feedback message must not be empty'
      },
      len: {
        args: [1, 255], // Minimum and maximum length of feedback message
        msg: 'Feedback message must be between 1 and 255 characters'
      }
    }
  },
  feedback_category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Feedback category is required'
      },
      notEmpty: {
        msg: 'Feedback category must not be empty'
      },

      // isIn: {
      //   args: [['general', 'service', 'product', 'other']], // Allowed feedback categories
      //   msg: 'Invalid feedback category'
      // }
    }
  }
  
});
// Define the association
Feedback.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Feedback;