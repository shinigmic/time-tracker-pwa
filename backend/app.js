require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const apiRouter = require('./routes/indexRoutes');

const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Use built-in JSON and URL-encoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  require('cors')({
    origin: 'https://localhost',
    credentials: true,
  })
);

// Redirect root to /api/
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Mount the API router
app.use('/api', apiRouter);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// // Define HTTPS credentials
// const credentials = {
//   key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
// };

// // Start the HTTPS server

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(PORT, () => {
//   console.log(`HTTPS Server started on port ${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});

const cron = require('node-cron');
const splitOvernightEntries = require('./scripts/splitOvernightEntries');

// start 00:00
cron.schedule('0 0 * * *', () => {
  console.log('[CRON] Running overnight activity splitter...');
  splitOvernightEntries().catch((err) => {
    console.error('[CRON] ❌ Error in overnight entry splitter:', err);
  });
});
