const express = require('express');

const rootRouter = require('./rootRoutes.js');
const loginRouter = require('./loginRoutes.js');
const registerRouter = require('./registerRoutes.js');
const userRouter = require('./userRoutes.js');
const activityTypesRouter = require('./activityTypeRoutes.js');
const timeEntryRoutes = require('./timeEntryRoutes.js');

const router = express.Router();

const { checkAuth } = require('../middleware/checkAuth.js');
const { checkToken } = require('../middleware/checkToken.js');
const globalRateLimiter = require('../middleware/globalRateLimiter.js');
const registerLimiter = require('../middleware/registerLimiter.js');
router.use(globalRateLimiter);

// If your middleware is registered before certain routes, it will be applied to all subsequent routes.

router.use('/', rootRouter);
router.use('/register', registerLimiter, registerRouter); // For initial registration, without `checkToken`

// Routes where `checkToken` is not required or special conditions apply:
router.use('/login', checkAuth, loginRouter); // For authentication, without `checkToken`

// Apply `checkToken` to all remaining routes
router.use(checkToken);
router.use('/user', userRouter);
router.use('/activity-types', activityTypesRouter);
router.use('/time-entries', timeEntryRoutes);

module.exports = router;
