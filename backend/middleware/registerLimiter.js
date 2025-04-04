const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 registration requests per windowMs
  message: {
    error:
      'Too many accounts created from this IP, please try again after an hour',
  },
  // Custom handler to return JSON response
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = registerLimiter;
