const User = require('../models/userModel');
const Similarity = require('../models/similarityModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Sequelize, where } = require("sequelize")
const path = require('path');
const axios = require('axios')
const imagesDirectory = path.join(__dirname, "..", 'images');
const admin = require("firebase-admin");

// var serviceAccount = require('../config/serviceAccountKey.json');
// const certPath = admin.credential.cert(serviceAccount);
// admin.initializeApp({
//   credential: certPath
// });

// user regustration with email verification
exports.registerUser = async (req, res) => {
  try {
    const { full_name,username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Generate a random verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');


    // Create the new user
    const user = await User.create({
      full_name,
      username,
      email,
      password: hashedPassword,
      verified: 0,
      profile_status: 0,
      verificationToken: verificationToken,
    });


    // Send the verification email
    await sendVerificationEmail(req, email, verificationToken);


    res.status(201).json({ message: 'User registered successfully, and verify your email' });
  } 
  catch (error) {
    // Handling specific types of errors
  
    // Bcrypt hashing errors
    if (error.name === 'BcryptError' || error.message.includes('bcrypt hashing error')) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ message: 'Error hashing password', error: error.message });
    }
  
    // Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map((err) => err.message);
      return res.status(400).json({ errors });
    }
  
    // Handle other Sequelize errors, e.g., unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Unique constraint violation', error: error.message });
    }
  
    // Handle general server errors
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// send verification email
const sendVerificationEmail = async (req, email,verificationToken) => {
  try {
  
    // Define the email template
    const emailTemplate = `
      <html>
    <body>
      <h1>Verify your email</h1>
      <p>Please click the button below to verify your email:</p>
      <a href="http://localhost:3000/api/users/verify?token=${verificationToken}">
        <button>Verify Email</button>
      </a>
    </body>
  </html>

    `;

    // Configure the email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Verify your email',
      html: emailTemplate
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
        secure:'true',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
});

// verify users email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
  
    console.log('Received token:', token);

    // Find the user by the verification token
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      console.log('User not found:', token);
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    // Update the user's verified status and clear the verification token from the session
    user.verified = 1;
    // user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve the user from the database
    const user = await User.getUserByUsername(username);

    // Check if the user is verified (1 = verified, 0 = not verified)
    if (user.verified === 0) {
      res.status(401).json({ message: 'User is not verified' });
      return;
    }


    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Generate a token with the user ID and role =user
    // const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const token = jwt.sign({ userId: user.id, role: 'user' }, process.env.SECRET_KEY, { expiresIn: '1h' });



    res.status(200).json({ message: 'User logged in successfully', token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  
};



// Create User Profile
exports.createUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const newUserId = userId;
    const { gender, religion, age, budget, image, personal_id, bio, phone_number, address, job_status, smoking, pets, privacy, religious_compatibility, socialize,fcm_token } = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).send("Files are missing");
    }
    const imagePath1 = path.join(imagesDirectory, files["image"][0].filename);
    const imagePath2 = path.join(imagesDirectory, files["personal_id"][0].filename)
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update the user profile data
    user.age = age;
    user.budget = budget;
    user.image = imagePath1;
    user.gender = gender;
    user.religion = religion;
    user.personal_id = imagePath2;
    user.bio = bio;
    user.phone_number = phone_number;
    user.address = address;
    user.job_status = job_status;
    user.smoking = smoking;
    user.pets = pets;
    user.privacy = privacy;
    user.religious_compatibility = religious_compatibility;
    user.socialize = socialize;
    user.fcm_token = fcm_token;
    user.profile_status = 1;
    user.activate_status = 1;
    await user.save(); // Save the updated user profile

    // Retrieve other users' data 
    const otherUsers = await User.findAll();
    // Create an array to hold user data and other users' data
    const userData = [];

    // Add other users' data to the array
    for (const otherUser of otherUsers) {

      // Check if the user has a full profile and activate status is on
      if (

        otherUser.profile_status == 1 &&
        otherUser.activate_status == 1) {
        userData.push({
          user: {
            id: otherUser.id,
            age: otherUser.age,
            budget: otherUser.budget,
            gender: otherUser.gender,
            religion: otherUser.religion,
            bio: otherUser.bio,
            address: otherUser.address,
            job_status: otherUser.job_status,
            smoking: otherUser.smoking,
            pets: otherUser.pets,
            privacy: otherUser.privacy,
            religious_compatibility: otherUser.religious_compatibility,
            socialize: otherUser.socialize,
            profile_status: otherUser.profile_status,
            activate_status: otherUser.activate_status,
          }
        });
      }

    }

    // 
    axios.post('http://127.0.0.1:5000/calculate', userData).then(async (response) => {
      const similarityScores = response.data['matches']
      try {
        for (const score of similarityScores) {
          const { userId, similarityScores } = score;

      // Check if the user already exists in the similarity table
      let existingUser = await Similarity.findOne({ where: { userId } });

      // Filter similarity scores to keep only those >= 40
      const filteredScores = Object.fromEntries(
        Object.entries(similarityScores).filter(([key, value]) => value >= 50)
      );

      // Update or create record only if there are valid similarity scores
      if (Object.keys(filteredScores).length > 0) {
        if (existingUser) {
          // User already exists, update the similarity scores
          existingUser.similarityScores = filteredScores;
          await existingUser.save();
        } else {
          // User does not exist, create a new record
          await Similarity.create({ userId, similarityScores: filteredScores });
        }
      }
        
        }
        

        // check and send the notification
        for (const score of similarityScores) {
          const { userId, similarityScores } = score;
  
          // Check if the new user's ID is in the similarity scores
          if (similarityScores[newUserId]) {
            // Find the user corresponding to the user ID
            const otherUser = await User.findByPk(userId);
            if (otherUser && otherUser.fcm_token) {
              // Send push notification to the user
              await sendPushNotification(otherUser.fcm_token, {
                title: 'New Recommended User',
                body: `A new user is recommended for you.`
              });
            }
          }
        }


      } catch (error) {
        console.error('Error saving similarity scores:', error);

      }
      
    }).catch(error => {
      console.log(error)
    })
    res.status(200).json({
      message: 'User profile created successfully',
      userData: userData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// notification
const sendPushNotification = async (fcmToken, message) => {
  try {
    let notificationMessage = {
      notification: {
        title: message.title,
        body: message.body
      },
      
      token: fcmToken
    };

    await admin.messaging().send(notificationMessage);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};




exports.recommendedStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    // Fetch the user's current password and activate_status
    const user = await User.findByPk(userId, {
      attributes: ['password', 'activate_status'],
    });

    // Compare the sent password with the user's password
    if (await bcrypt.compare(password, user.password)) {
      // Update the activate status based on the current status
      const newStatus = user.activate_status === 1 ? 0 : 1;

      // Update the user's activate status
      await User.update({ activate_status: newStatus }, {
        where: { id: userId },
      });

      res.status(200).json({
        success: true,
        message: `Activate status updated to ${newStatus}`,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating activate status',
      error: error.message,
    });
  }
};

// get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// get single user
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findOne({
      where: {
        id: userId
      }
    }
    )
    res.status(200).json({ user: user })
  }
  catch (error) {
    console.log(error)
    res.status(500).json()
  }
}


// Update User Profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { full_name, username, gender, religion, age, budget, image, personal_id, bio, phone_number, address, job_status, smoking, pets, privacy, religious_compatibility, socialize } = req.body;


    await User.update({
      full_name,
      username,
      gender,
      religion,
      age,
      budget,
      image,
      personal_id,
      bio,
      phone_number,
      address,
      job_status,
      smoking,
      pets,
      privacy,
      religious_compatibility,
      socialize
    }, {
      where: {
        id: userId
      }
    });

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete The created account
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({
      where: {
        id: userId
      }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// update payment status
exports.changePaymentStatus = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    await User.update({
      payment_status: 1
    },
      {
        where: {
          id: userId
        }
      })

    res.json("payment status updated");
  }
  catch (err) {
    res.json("error has occured while updating payment status")
  }
}

exports.getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findOne({
      attributes: ['profile_status', 'payment_status'],
      where: { id: userId }
    });
    res.json(user);
  }
  catch (err) {
    res.status(500).json(err);
  }
}
