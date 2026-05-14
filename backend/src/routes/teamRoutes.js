const router = require('express').Router();
const { teamController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', teamController.list);
router.get('/:id', teamController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), teamController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), teamController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), teamController.remove);

module.exports = router;

