const express = require('express');
const app = express();

app.use(express.json());

// User routes
const userRoutes = require('./routes/userRoute');
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});