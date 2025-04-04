const express = require('express');
const { getRootHandler } = require('../controllers/rootController');

const router = express.Router();

router.get('/', getRootHandler);

module.exports = router;
