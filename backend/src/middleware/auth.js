const { verifyToken } = require('../utils/jwt');
const { User, Role } = require('../models');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Missing access token' });
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id, {
      include: [{ model: Role, as: 'roles', attributes: ['name'], through: { attributes: [] } }]
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name)
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid access token' });
  }
}

module.exports = authenticate;

