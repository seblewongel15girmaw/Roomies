

const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  religion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  budget: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  personal_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  job_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  smoking: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pets: {
    type: DataTypes.STRING,
    allowNull: true
  },
  privacy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  religious_compatibility: {
    type: DataTypes.STRING,
    allowNull: true
  },
  socialize: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verified: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  payment_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  activate_status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
});


User.getUserByUsername = async function (username) {
  return User.findOne({
    where: {
      username: username
    }
  });
};

User.getUserByEmail = async function (email) {
  return User.findOne({
    where: {
      email: email
    }
  });
};

module.exports = User;