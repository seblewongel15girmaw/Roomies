
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Admin = sequelize.define('Admin', {
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
  
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
});


Admin.getAdminByEmail = async function (email) {
  return Admin.findOne({
    where: {
      email: email
    }
  });
};

module.exports = Admin;