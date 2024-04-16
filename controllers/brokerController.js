const mysql = require("mysql2")
const Broker = require("../models/brokerModel")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const cloudinary = require("cloudinary").v2
require("dotenv").config()

const path = require("path")
const imagesDirectory = path.join(__dirname, "..", 'images');

cloudinary.config({
    cloud_name: "dqdhs44nq",
    api_key: "884882689968516",
    api_secret: "gf7mi7J1k5jjo_PeDJEBW0tzbms"
})


// const signUp = async (req, res) => {
//     try {
//         const { password } = req.body
//         const hashed = await bcrypt.hash(password, 10)
//         const broker = await Broker.create({ ...req.body, password: hashed })
//         res.json(broker)
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

// Function to generate a random password
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
  
  
  // Function to register a new broker
  async function signUp(req, res) {
    try {
      // Generate a random password
      const password = generatePassword();
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new broker record in the database
      const createdBroker = await Broker.create({
        full_name: req.body.full_name,
        username: req.body.username,
        phone_number1: req.body.phone_number1,
        phone_number2: req.body.phone_number2,
        password: hashedPassword,
        address: req.body.address,
        gender: req.body.gender,
        email: req.body.email // Assuming you have added the 'email' field to your model
      });
  
     

    

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
        to: createdBroker.email, // Send the email to the broker's registered email address
        subject: 'Account Registration',
        text: `Your account has been registered. Your password is: ${password}`
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
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
const signIn = async (req, res) => {
    try {
        const { password, username } = req.body
        const brokerInfo = await Broker.findOne({ username: username })
        if (brokerInfo== null) {
            return res.json("user not found")
        }
        const compare = bcrypt.compare(password, brokerInfo.password)
        if (!compare) {
            return res.json("incorrect password")
        }
        const token = jwt.sign({
            payload: {
                brokerId: brokerInfo.brokerId,
            },
        }, process.env.JWT_SECRET,
            {
                expiresIn: "10d"
            }
        )

        res.cookie("auth-token", token, { httpOnly: true, strict: true, sameSite: "Strict" })
        res.json({ token: token, message: 'logged in' })

    }
    catch (err) {
        console.log(err)
    }
}


const createProfile = async (req, res) => {
    try {
        const files = req.file;
        if (!files || files.length === 0) {
            return res.status(400).send("Files are missing");
        }
        const imagePath = path.join(imagesDirectory, files.filename);
        const { phoneNumber1, email } = req.body;
        const { brokerId } = req.user
        const profile = await BrokerProfile.create({
            phoneNumber1: phoneNumber1,
            email: email,
            brokerProfilePic: imagePath,
            brokerId: brokerId
        });

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
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

module.exports = { createProfile, viewProfile, editProfile, signIn, signUp, getBrokerProfile, getAllBrokers }

