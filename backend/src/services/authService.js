const { User, Role } = require('../models');
const { ROLES } = require('../config/roles');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const httpError = require('../utils/httpError');

async function serializeUser(user) {
  const roles = user.roles ? user.roles.map((role) => role.name) : [];
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    status: user.status,
    roles
  };
}

async function register(data) {
  const existed = await User.findOne({ where: { email: data.email } });
  if (existed) throw httpError(409, 'Email already exists');

  const role = await Role.findOne({ where: { name: ROLES.USER } });
  if (!role) throw httpError(500, 'Default role USER is not seeded');

  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    passwordHash: await hashPassword(data.password)
  });

  await user.addRole(role);

  const userWithRoles = await getProfile(user.id);
  return { token: signToken(user), user: await serializeUser(userWithRoles) };
}

async function login(email, password) {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
  });

  if (!user) throw httpError(401, 'Invalid email or password');

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) throw httpError(401, 'Invalid email or password');
  if (user.status !== 'ACTIVE') throw httpError(403, 'User is locked');

  return { token: signToken(user), user: await serializeUser(user) };
}

function getProfile(id) {
  return User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
    include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }]
  });
}

module.exports = { register, login, getProfile };

