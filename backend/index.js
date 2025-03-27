const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { createClient } = require('redis');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/timeTracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// (Тільки якщо ти плануєш щось кешувати)
// const redisClient = createClient();
// redisClient.connect().then(() => {
//   console.log('Connected to Redis');
// });

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
