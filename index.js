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

// Set up the multer middleware for handling file uploads
// const upload = multer({ dest: 'uploads/' });


// const sessionStore = new MySQLStore(
//   {
//     clearExpired: true,
//     checkExpirationInterval: 900000, // How often expired sessions should be cleared (in milliseconds)
//     expiration: 86400000, // The maximum age (in milliseconds) of a valid session
//   },
//   pool
// );

// Add session middleware

// app.use(
//   session({
//   secret: '4n339f8r4nD0m$tr!ng', // Replace with your own secret key
//   resave: false,
//   saveUninitialized: false,
//   store: sessionStore,
// }));

// CORS middleware

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

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
