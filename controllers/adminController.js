const Admin = require("../models/adminModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require("sequelize")

exports.registerAdmin = async (req, res) => {
    try {
      const { full_name, username, email, password,phone_number,gender } = req.body;
  
      // Check if the username or email already exists in the database
      const existingAdmin = await Admin.findOne({
        where: {
          [Sequelize.Op.or]: [{ username }, { email }]
        }
      });
  
      if (existingAdmin) {
        res.status(400).json({ message: 'Username or email already exists' });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const adminData = {
        full_name,
        username,
        email,
        password: hashedPassword,
        gender,
        phone_number
      };
  
      const admin = await Admin.create(adminData);
  
      res.status(201).json({ message: 'Admin registered successfully', adminId: admin.id });
    } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


  // get all admins
  exports.getAllAdmins = async (req, res) => {
    try {
      const admins = await Admin.findAll();
  
      res.status(200).json(admins);
    } catch (error) {
      console.error('Error retrieving admins:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };