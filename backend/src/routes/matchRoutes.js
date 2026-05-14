const router = require('express').Router();
const matchController = require('../controllers/matchController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', matchController.list);
router.get('/:id', matchController.getById);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), matchController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.ORGANIZER), matchController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), matchController.remove);
router.patch('/:id/result', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.REFEREE), matchController.updateResult);

module.exports = router;

