const sequelize = require("../config/dbConfig");
const { DataTypes } = require("sequelize");
const User = require("../models/userModel")

const Feedback = sequelize.define("Feedback", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Rating is required'
      },
      notEmpty: {
        msg: 'Rating must not be empty'
      },
      isDecimal: {
        msg: ' rating must be a decimal number'
      },
      min: {
        args: [1.0], // Minimum value allowed for double rating
        msg: 'Double rating must be at least 1.0'
      },
      max: {
        args: [5.0], // Maximum value allowed for double rating
        msg: 'Double rating must be at most 5.0'
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
        args: [1, 400], // Minimum and maximum length of feedback message
        msg: 'Its to long'
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