const express = require('express');
require("dotenv").config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const sequelize = require('./config/dbConfig.js');
const pool = require('./config/dbConfig');
const associations=require("./models/association.js")
// const multer = require('multer');

app.use(express.json());

// Routes


// User routes
const userRoutes = require('./routes/userRoute');
const brokerRoutes = require('./routes/brokerRoute');
const guarantorRoutes = require('./routes/guarantorRoute');
const chatRoutes = require('./routes/chatRoute');
const houseRoutes = require('./routes/houseRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
// const HouseImageRoutes = require('./routes/houseImageRoute');


app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/guarantors', guarantorRoutes);
app.use('/api', chatRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/feedback', feedbackRoutes);
// app.use('/api/house-images', HouseImageRoutes);


async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

syncDatabase();
associations();


// const PORT = 3000;
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
