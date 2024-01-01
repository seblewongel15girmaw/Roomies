const express = require('express')
require("dotenv").config()
const houseRouter=require("./routes/houseRoute")
const brokerRouter=require("./routes/brokerRoute")
const sequelize = require('./config/dbConfig')

const app = express()
app.use(express.json())
app.use("/house",houseRouter)
app.use("/broker",brokerRouter)

sequelize.sync();

app.listen(process.env.PORT, () => {
    console.log("server started")
})