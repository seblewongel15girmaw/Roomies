// // Function to generate a random password


const mysql = require("mysql2")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
// const cloudinary = require("cloudinary").v2
require("dotenv").config()

  // Generate a random password
  function generatePassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    console.log('Generated Password:', password);
    return password;
  }
  
  // Send generated password
  async function sendGeneratedPassword(req, res) {
    const { email } = req.body;

  
    try {
      // Find the user with the provided email

    const user = await User.getUserByEmail(email);
 
  
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }
  
      // Generate a new random password
    const newPassword = generatePassword();

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure:'true',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: user.email, // Send the email to the broker's registered email address
        subject: 'Password Updated successfully',
        text: `Your password rest is done successfully. Your New Password is: ${newPassword}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            res.status(500).json({ message: 'Failed to send email', error: error.message });
        } else {
          console.log('Email sent successfully!');
          res.status(201).json({ message: 'password reset successfully!' });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internallllll server error',error: error.message  });
    }
  }

module.exports = { sendGeneratedPassword}
