const express = require('express');
require("dotenv").config();
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

//run when a client connect

var clients = {}

io.on("connection", socket => {
  console.log("new connection")
  // console.log(socket.id)
  // socket.on(event, msg => {
  //   console.log(msg)
  // })
})



// const PORT = 3000;
server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
