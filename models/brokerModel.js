const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

const Broker = sequelize.define('Broker', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number1: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  phone_number2: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_pic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Broker;