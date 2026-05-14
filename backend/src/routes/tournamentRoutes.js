const router = require('express').Router();
const { tournamentController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', tournamentController.list);
router.get('/:id', tournamentController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), tournamentController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), tournamentController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), tournamentController.remove);

module.exports = router;

