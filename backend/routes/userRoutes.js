const express = require('express');
const {
  getSingleUserHandler,
  putSingleUserHandler,
  deleteSingleUserHandler,
} = require('../controllers/userController');

const router = express.Router();

router.get('/:userId', getSingleUserHandler);
router.put('/:userId', putSingleUserHandler);
router.delete('/:userId', deleteSingleUserHandler);

module.exports = router;
