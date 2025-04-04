const rateLimit = require('express-rate-limit');

const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after a minute.',
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = globalRateLimiter;
