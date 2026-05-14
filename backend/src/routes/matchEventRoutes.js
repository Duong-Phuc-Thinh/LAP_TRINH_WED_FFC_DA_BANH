const router = require('express').Router();
const matchEventController = require('../controllers/matchEventController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.get('/', matchEventController.list);
router.get('/match/:matchId', matchEventController.listByMatch);
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.REFEREE), matchEventController.create);
router.put('/:id', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.REFEREE), matchEventController.update);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), matchEventController.remove);

module.exports = router;

