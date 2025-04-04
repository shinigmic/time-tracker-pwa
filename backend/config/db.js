const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({
  path: path.resolve(__dirname, `../.env`),
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
