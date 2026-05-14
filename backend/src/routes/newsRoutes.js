const router = require('express').Router();
const { newsController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', newsController.list);
router.get('/:id', newsController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), newsController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), newsController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), newsController.remove);

module.exports = router;

