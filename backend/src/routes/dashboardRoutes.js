const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/summary', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), dashboardController.summary);

module.exports = router;

