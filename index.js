const express = require('express');
const app = express();

app.use(express.json());

// User routes
const userRoutes = require('./routes/userRoute');
const brokerRoutes = require('./routes/brokerRoute');
const guarantorRoutes = require('./routes/guarantorRoute');

app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/guarantors', guarantorRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});