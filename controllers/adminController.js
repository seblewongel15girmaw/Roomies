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

  // login admins
  
  exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Retrieve the admin from the database
      const admin = await Admin.getAdminByEmail(email);
  
      if (!admin) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
  
      // Compare the hashed password
      const isMatch = await bcrypt.compare(password, admin.password);
  
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
  
      // Generate a token with the admin ID
      // const token = jwt.sign({ adminId: admin.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const token = jwt.sign({ adminId: admin.id, role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1h' });

  
      res.status(200).json({ message: 'Admin logged in successfully', token });
  
    } catch (error) {
      console.error('Error logging in admin:', error);
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


// Logout admin
exports.logoutAdmin = async (req, res) => {
  try {
    const { authorization } = req.headers;

    // Extract the token from the Authorization header
    const token = authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Invalid token' });
        return;
      }

      // Perform any necessary cleanup or additional logic for admin

      // Example: Update admin's last logout time
      const adminId = decoded.adminId;
      const admin = // Retrieve the admin from your database using the adminId
      admin.lastLogout = new Date();
      admin.save();

      res.status(200).json({ message: 'Admin logged out successfully' });
    });
  } catch (error) {
    console.error('Error logging out admin:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};