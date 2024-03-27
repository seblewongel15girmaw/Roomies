
const mysql = require("mysql2")
const { Broker, BrokerProfile } = require("../models/brokerModel")
const bcrypt = require("bcrypt")
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


const signUp = async (req, res) => {
    try {
        const { password } = req.body
        const hashed = await bcrypt.hash(password, 10)
        const broker = await Broker.create({ ...req.body, password: hashed })
        res.json(broker)
    }
    catch (err) {
        console.log(err)
    }
}

const signIn = async (req, res) => {
    try {
        const { password, username } = req.body
        const brokerInfo = await Broker.findOne({ username: username })
        if (!brokerInfo) {
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
        // const imageUrls = await cloudinary.uploader.upload(files.path);
        // if (!imageUrls || imageUrls.length === 0) {
        //     return res.status(500).send("Error uploading images to Cloudinary");
        // }
        // console.log(imageUrls)
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


const getBrokerProfile = async (req, res) => {
    const { brokerId } = req.user
    const brokerProfile = await BrokerProfile.findOne({ where: { brokerId: brokerId } });

    res.json(brokerProfile)
}

const getAllBrokers = async (req, res) => {
    const brokers = await BrokerProfile.findAll()
    res.json(brokers)
}


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

