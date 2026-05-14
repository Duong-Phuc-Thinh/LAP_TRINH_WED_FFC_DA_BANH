const router = require('express').Router();
const { notificationController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.use(authenticate);
router.get('/', notificationController.list);
router.post('/', authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), notificationController.create);
router.put('/:id', notificationController.update);
router.delete('/:id', authorizeRoles(ROLES.ADMIN), notificationController.remove);

module.exports = router;

