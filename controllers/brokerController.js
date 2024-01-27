const mysql = require("mysql2")
const pool = require("../config/dbConfig")
const Profile = require("../models/brokerProfileModel")
const Broker = require("../models/brokerModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { cloudinary } = require("../config/cloudinary")
require("dotenv").config()

const signUp = async (req, res) => {
  try {
    const { password } = req.body
    const hashed = bcrypt.hash(password, 10)
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

    res.json({ token: token, message: 'logged in' })

  }
  catch (err) {
    console.log(err)
  }
}

const createProfile = async (req, res) => {

  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
    const { phoneNumber1, phoneNumber2, email, brokerProfilePic } = req.body
    const { brokerId } = req.user
    const profile = await Profile.create({
      phoneNumber1: phoneNumber1, phoneNumber2: phoneNumber2,
      email: email, brokerId: brokerId, brokerProfilePic: result.secure_url
    })
    res.json(profile)

  }
  catch (err) {
    console.log(err)
  }


}

const viewProfile = async (req, res) => {

}

const editProfile = async (req, res) => {

}

module.exports = { createProfile, viewProfile, editProfile, signIn, signUp }
