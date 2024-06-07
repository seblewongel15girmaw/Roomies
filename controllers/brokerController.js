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


const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const sessions = new Map(); // In-memory session storage



async function signup(req, res) {
  const { full_name, phone_number1, password, address, gender, email } = req.body;

  const files = req.file;
  if (!files) {
    return res.status(400).send("Files are missing");
  }
  const imagePath = path.join(imagesDirectory, files.filename);

  // Check if phone number is already registered
  const existingBroker = await Broker.findOne({ where: { phone_number1 } });
  if (existingBroker) {
    return res.status(400).json({ error: 'Phone number is already registered' });
  }

  // Generate a verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the verification code and user details in a session
  const sessionId = generateSessionId();
  sessions.set(sessionId, { verificationCode, full_name, phone_number1, password, address, gender, email, imagePath });

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

async function verify(req, res) {
  const { verificationCode, sessionId } = req.body;

  // Check if the session exists and the verification code is valid
  const session = sessions.get(sessionId);
  if (session && session.verificationCode === verificationCode) {
    const { full_name, phone_number1, password, address, gender, email, imagePath } = session;

    // Create the user account
    const newBroker= await createUserAccount(full_name, phone_number1, password, address, gender, email, imagePath);

    // Generate token using userId
    const token = jwt.sign({ brokerId: newBroker.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove the session
    sessions.delete(sessionId);

    res.status(200).json({ message: 'Phone number verified',token });
  } else {
    res.status(400).json({ error: 'Invalid verification code or session' });
  }
}

async function createUserAccount(
  full_name,
  phone_number1,
  password,
  address,
  gender,
  email,
  profile_pic
) {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the broker
    const broker = new Broker({
      full_name,
      phone_number1,
      password: hashedPassword,
      address,
      gender,
      email,
      profile_pic: profile_pic
    });

    // Save the broker and return the created object
    const newBroker = await broker.save();
    return newBroker;
  } catch (error) {
    console.error('Error creating broker account:', error);
    throw error;
  }
}


function generateSessionId() {
  return crypto.randomUUID();
}


  
// Function to register a new broker
//  async function signUp(req, res) {
//     try {
      // const files = req.file;
      // if (!files || files.length === 0) {
      //   return res.status(400).send("Files are missing");
      // }
      // const imagePath = path.join(imagesDirectory, files.filename);
  
//       const password = req.body.password;
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       // Generate a verification code
//       const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  
//       // Create a new broker record in the database
//       const createdBroker = await Broker.create({
//         full_name: req.body.full_name,
//         phone_number1: req.body.phone_number1,
//         phone_number2: req.body.phone_number2,
//         password: hashedPassword,
//         address: req.body.address,
//         gender: req.body.gender,
//         email: req.body.email,
//         profile_pic: imagePath,
//         verify: verificationCode
//       });
  
//       // Send the verification code via SMS using Twilio
//       const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//       await client.messages.create({
//         body: `Your verification code is: ${verificationCode}`,
//         from: process.env.TWILIO_PHONE_NUMBER,
//         to: req.body.phone_number1
//       });
  
//       // Send the email confirmation
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         secure: 'true',
//         auth: {
//           user: process.env.EMAIL_USERNAME,
//           pass: process.env.EMAIL_PASSWORD
//         }
//       });
  
//       const mailOptions = {
//         from: process.env.EMAIL_USERNAME,
//         to: createdBroker.email,
//         subject: 'Thank You for Registering with Begara',
//         text: `Dear ${createdBroker.full_name},
  
//         Thank you for registering with Begara. We have sent a verification code to your phone number. Please enter the code to complete the registration process.
//         `
//       };
  
//       await transporter.sendMail(mailOptions);
  
//       res.status(201).json({ message: 'Broker registered successfully!' });
//     } catch (error) {
//       console.error('Error occurred:', error);
//       res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
//   }






  
  // verify brokers account 
  async function updateVerification(req, res) {
    try {
      const brokerId = req.params.id;
  
      // Find the broker by ID
      const broker = await Broker.findByPk(brokerId);
      // Update the verify field to 1
      broker.verify = 1;
     
      await broker.save();

      // send email for brokers to our legal brokers
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
        to: broker.email, // Send the email to the broker's registered email address
        subject: 'Verify House Supplier Accounts',
        text: `Dear ${broker.full_name},

        We are pleased to inform you that your broker verification has been successfully completed.
         Congratulations, you are now a Verified House Supplier with our organization.


         Thank you for your trust and commitment to working with us.
          We appreciate your valuable contribution and look forward to a long-standing and mutually beneficial relationship.

`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error.message);
            res.status(500).json({ message: 'Failed to send email', error: error.message });
        } else {
          console.log('Email sent successfully!');
          res.status(201).json({ message: 'Broker registered successfully!' });
        }
      });
  
      console.log(`Broker with ID ${brokerId} has been verified.`);
      res.status(200).json({ message: 'Broker verification updated successfully' });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }



//   a function to login brokers
  async function signIn (req, res) {
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


const getBrokerProfile = async (req, res) => {
    const { brokerId } = req.user
    const brokerProfile = await BrokerProfile.findOne({ where: { brokerId: brokerId } });

    res.json(brokerProfile)
}

// const getAllBrokers = async (req, res) => {
//     const brokers = await Broker.findAll()
//     res.json(brokers)
// }


const uploadImageToCloudinary = (imageBuffer) => {
    return new Promise((resolve, reject) => {
        if (!imageBuffer) {
            reject("Image buffer is undefined");
            return;
        }

        cloudinary.uploader
            .upload_stream((error, result) => {
                if (error || !result) {
                    reject(error);
                } else {
                    resolve(result.url);
                }
            })
            .end(imageBuffer);
    });
};


const uploadMultipleImage = (images) => {
    return new Promise((resolve, reject) => {
        const uploads = images.map((base) => uploadImageToCloudinary(base));
        console.log("hi there")

        Promise.all(uploads)
            .then((values) => resolve(values))
            .catch((err) => reject(err));
    });
};


const checkProfileAvailability = async (req, res) => {
    try {
        const { brokerId } = req.body
        const broker = await BrokerProfile.findOne({ brokerId: brokerId })
        if (!broker) {
            return false
        }
        return true
    }

    catch (err) {
        console.log(err)
    }
}


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

module.exports = {  viewProfile, editProfile, signIn, verify,signup, getBrokerProfile, getAllBrokers,updateVerification }

