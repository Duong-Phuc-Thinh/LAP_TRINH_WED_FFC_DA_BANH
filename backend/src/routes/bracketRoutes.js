const router = require('express').Router();
const bracketController = require('../controllers/bracketController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/tournaments/:tournamentId', bracketController.listKnockout);
router.post(
  '/tournaments/:tournamentId/semi-finals',
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER),
  bracketController.generateSemiFinals
);

module.exports = router;

