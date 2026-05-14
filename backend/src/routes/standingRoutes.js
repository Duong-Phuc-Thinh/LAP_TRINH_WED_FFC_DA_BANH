const router = require('express').Router();
const standingController = require('../controllers/standingController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/tournaments/:tournamentId', standingController.listByTournament);
router.post(
  '/tournaments/:tournamentId/groups/:groupId/recalculate',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  standingController.recalculateGroup
);

module.exports = router;

