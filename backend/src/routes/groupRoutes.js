const router = require('express').Router();
const { groupController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', groupController.list);
router.get('/:id', groupController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), groupController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), groupController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), groupController.remove);

module.exports = router;

