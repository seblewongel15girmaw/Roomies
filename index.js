const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser')
const app = express();
const sequelize = require('./config/dbConfig.js');
const associations = require("./models/association.js")
const socketIo=require("socket.io")
const http = require("http")
const cors = require("cors")
// const multer = require('multer');

const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin:"*"
  }
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// Routes


// User routes

const userRoutes = require('./routes/userRoute');
const brokerRoutes = require('./routes/brokerRoute');
const guarantorRoutes = require('./routes/guarantorRoute');
const chatRoutes = require('./routes/chatRoute');
const houseRoutes = require('./routes/houseRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const adminRoutes = require('./routes/adminRoute');
const dashboardRoutes = require('./routes/dashboardRoute.js');

const similarityRoute = require('./routes/similarityRoute.js')
// const HouseImageRoutes = require('./routes/houseImageRoute');


app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/guarantors', guarantorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roommate', similarityRoute);
app.use('/api/home', dashboardRoutes);
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

//run when a client connect

var clients = {}




io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on("start", (data) => {
    console.log(data)
    clients[data]=socket.id
  })
  socket.on('message', (data) => {
    console.log('Message received from user:', data.receiverId, data.message);
    
    io.to(clients[data.receiverId]).emit('message', data); // Send message to the specific user
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// const PORT = 3000;
server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
