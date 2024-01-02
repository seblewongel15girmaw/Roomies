const express = require('express');
const app = express();

app.use(express.json());

// User routes
const userRoutes = require('./routes/userRoute');
const brokerRoutes = require('./routes/brokerRoute');

app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});