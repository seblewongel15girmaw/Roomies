
const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");


const Broker = sequelize.define('Broker', {
  brokerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber1: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  phoneNumber2: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brokerProfilePic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }

});



module.exports = Broker;
