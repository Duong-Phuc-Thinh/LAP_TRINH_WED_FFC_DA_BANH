const router = require('express').Router();
const { stadiumController } = require('../controllers/resourceControllers');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', stadiumController.list);
router.get('/:id', stadiumController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), stadiumController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), stadiumController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), stadiumController.remove);

module.exports = router;

