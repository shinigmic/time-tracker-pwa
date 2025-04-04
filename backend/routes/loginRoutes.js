const express = require('express');
const { getLoginHandler } = require('../controllers/loginController');

const router = express.Router();

router.get('/', getLoginHandler);

module.exports = router;
