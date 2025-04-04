const express = require('express');

const rootRouter = require('./rootRoutes');
const loginRouter = require('./loginRoutes');
const registerRouter = require('./registerRoutes');
const userRouter = require('./userRoutes');
const activityTypesRouter = require('./activityTypeRoutes');
const timeEntryRoutes = require('./timeEntryRoutes');
const statisticsRoutes = require('./statisticsRoutes');

const router = express.Router();

const { checkAuth } = require('../middleware/checkAuth');
const { checkToken } = require('../middleware/checkToken');
const globalRateLimiter = require('../middleware/globalRateLimiter');
const registerLimiter = require('../middleware/registerLimiter');
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
router.use('/stats', statisticsRoutes);

module.exports = router;
