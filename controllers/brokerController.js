const mysql = require("mysql2")
const Broker = require("../models/brokerModel")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary").v2
require("dotenv").config()
const twilio = require('twilio');
const crypto = require('crypto');


const path = require("path")
const imagesDirectory = path.join(__dirname, "..", 'images');

//  twilio info
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const sessions = new Map(); // In-memory session storage


// sign up broker
async function signup(req, res) {
  const { full_name, phone_number1,phone_number2, password, address, gender, email } = req.body;

  const files = req.file;
  if (!files) {
    return res.status(400).send("Files are missing");
  }
  // const imagePath = path.join(imagesDirectory, files.filename);

  const imagePath1 = path.join(imagesDirectory, files["profile_pic"][0].filename);
  const imagePath2 = path.join(imagesDirectory, files["broker_personal_id"][0].filename)

  // Check if phone number is already registered
  const existingBroker = await Broker.findOne({ where: { phone_number1 } });
  if (existingBroker) {
    return res.status(400).json({ error: 'Phone number is already registered' });
  }

  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the verification code and user details in a session
  const sessionId = generateSessionId();
  sessions.set(sessionId, { verificationCode, full_name, phone_number1,phone_number2, password, address, gender, email, imagePath1,imagePath2 });

  // Send the verification code via SMS
  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: twilioPhoneNumber,
      to: phone_number1
    });

    res.status(200).json({ message: 'Verification code sent', sessionId });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Error sending verification code' });
  }
}

// verify users phone number
async function verify(req, res) {
  const { verificationCode, sessionId } = req.body;

  // Check if the session exists and the verification code is valid
  const session = sessions.get(sessionId);
  if (session && session.verificationCode === verificationCode) {
    const { full_name, phone_number1,phone_number2, password, address, gender, email, imagePath1,imagePath2 } = session;

    // Create the user account
    const newBroker = await createUserAccount(full_name, phone_number1,phone_number2, password, address, gender, email, imagePath1,imagePath2);

    // Generate token using userId
    const token = jwt.sign({ brokerId: newBroker.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove the session
    sessions.delete(sessionId);

    res.status(200).json({ message: 'Phone number verified', token });
  } else {
    res.status(400).json({ error: 'Invalid verification code or session' });
  }
}

async function createUserAccount(
  full_name,
  phone_number1,
  phone_number2,
  password,
  address,
  gender,
  email,
  profile_pic,
  broker_personal_id
) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the broker
    const broker = new Broker({
      full_name,
      phone_number1,
      phone_number2,
      password: hashedPassword,
      address,
      gender,
      email,
      profile_pic: profile_pic,
      broker_personal_id:broker_personal_id
    });

    // Save the broker and return the created object
    const newBroker = await broker.save();
    return newBroker;
  } catch (error) {
    console.error('Error creating broker account:', error);
    throw error;
  }
}

// generate session id
function generateSessionId() {
  return crypto.randomUUID();
}


//   a function to login brokers
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Retrieve the broker from the database
    const broker = await Broker.getBrokerByEmail(email);

    if (!broker) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, broker.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate a token with the broker ID
    const token = jwt.sign({ brokerId: broker.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    // console.log(token);

    res.status(200).json({ message: 'Broker logged in successfully', token });

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


// get all Brokers
const getAllBrokers = async (req, res) => {
  try {
    const brokers = await Broker.findAll();
    res.json(brokers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};





// const uploadImageToCloudinary = (imageBuffer) => {
//   return new Promise((resolve, reject) => {
//     if (!imageBuffer) {
//       reject("Image buffer is undefined");
//       return;
//     }

//     cloudinary.uploader
//       .upload_stream((error, result) => {
//         if (error || !result) {
//           reject(error);
//         } else {
//           resolve(result.url);
//         }
//       })
//       .end(imageBuffer);
//   });
// };


// const uploadMultipleImage = (images) => {
//   return new Promise((resolve, reject) => {
//     const uploads = images.map((base) => uploadImageToCloudinary(base));
//     console.log("hi there")

//     Promise.all(uploads)
//       .then((values) => resolve(values))
//       .catch((err) => reject(err));
//   });
// };


// const checkProfileAvailability = async (req, res) => {
//   try {
//     const { brokerId } = req.body
//     const broker = await BrokerProfile.findOne({ brokerId: brokerId })
//     if (!broker) {
//       return false
//     }
//     return true
//   }

//   catch (err) {
//     console.log(err)
//   }
// }

// view  brokers profile
const viewProfile = async (req, res) => {
  try {
    const { brokerId } = req.user
    const brokerProfile = await BrokerProfile.findOne({ brokerId: brokerId })
    res.json(brokerProfile)
  }
  catch (err) {
    console.log(err)
  }
}

// edit broker profile
const editProfile = async (req, res) => {
  try {
    const { brokerId } = req.user
    const { phoneNumber1, phoneNumber2, email } = req.body
    const brokerProfile = await BrokerProfile.findOne({ brokerId: brokerId })
    if (phoneNumber1) {
      brokerProfile.phoneNumber1 = phoneNumber1
    }
    if (phoneNumber2) {
      brokerProfile.phoneNumber2 = phoneNumber2
    }
    if (email) {
      brokerProfile.email = email
    }
    await brokerProfile.save()
    res.json("saved ")

  }
  catch (err) {
    console.log(err)
  }
}

module.exports = { viewProfile, editProfile, signIn, verify, signup, getAllBrokers }