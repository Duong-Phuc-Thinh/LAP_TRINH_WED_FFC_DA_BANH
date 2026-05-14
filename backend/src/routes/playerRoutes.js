const router = require('express').Router();
const { playerController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', playerController.list);
router.get('/:id', playerController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), playerController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), playerController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), playerController.remove);

module.exports = router;

