const express = require('express');
require("dotenv").config();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
const pool = require('./config/dbConfig');

app.use(express.json());


const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000, // How often expired sessions should be cleared (in milliseconds)
    expiration: 86400000, // The maximum age (in milliseconds) of a valid session
  },
  pool
);

// Add session middleware
app.use(
  session({
  secret: '4n339f8r4nD0m$tr!ng', // Replace with your own secret key
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// User routes
const userRoutes = require('./routes/userRoute');
const brokerRoutes = require('./routes/brokerRoute');
const guarantorRoutes = require('./routes/guarantorRoute');
const chatRoutes = require('./routes/chatRoute');
const houseRoutes = require('./routes/houseRoute');

app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/guarantors', guarantorRoutes);
app.use('/api', chatRoutes);
app.use('/api/houses', houseRoutes);


// const PORT = 3000;
app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});