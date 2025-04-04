/**
 * GET /
 * Returns basic information about the API.
 */

const getRootHandler = (req, res) => {
  res.json({
    message: 'Welcome to Personal Time Tracker API',
    status: 'OK',
  });
};

module.exports = { getRootHandler };
