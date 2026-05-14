const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const { ROLES } = require('../config/roles');

router.use(authenticate, authorizeRoles(ROLES.ADMIN));
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;

