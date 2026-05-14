const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/tournaments', require('./tournamentRoutes'));
router.use('/groups', require('./groupRoutes'));
router.use('/teams', require('./teamRoutes'));
router.use('/players', require('./playerRoutes'));
router.use('/stadiums', require('./stadiumRoutes'));
router.use('/matches', require('./matchRoutes'));
router.use('/match-events', require('./matchEventRoutes'));
router.use('/standings', require('./standingRoutes'));
router.use('/brackets', require('./bracketRoutes'));
router.use('/news', require('./newsRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));

module.exports = router;

