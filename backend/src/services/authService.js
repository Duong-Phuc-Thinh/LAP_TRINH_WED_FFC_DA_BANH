const { User, Role } = require('../models');
const { ROLES } = require('../config/roles');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const httpError = require('../utils/httpError');

async function serializeUser(user) {
  const roles = user.roles ? user.roles.map((role) => (typeof role === 'string' ? role : role.name)) : [];
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
  validateRegister(data);

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

  const userWithRoles = await getProfileModel(user.id);
  return { token: signToken(user), user: await serializeUser(userWithRoles) };
}

async function login(email, password) {
  if (!email || !password) throw httpError(400, 'Email and password are required');

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

async function getProfile(id) {
  const user = await getProfileModel(id);
  if (!user) throw httpError(404, 'User not found');
  return serializeUser(user);
}

function getProfileModel(id) {
  return User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
    include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }]
  });
}

function validateRegister(data) {
  if (!data.fullName || !data.email || !data.password) {
    throw httpError(400, 'Full name, email and password are required');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    throw httpError(400, 'Email is invalid');
  }

  if (String(data.password).length < 6) {
    throw httpError(400, 'Password must be at least 6 characters');
  }
}

module.exports = { register, login, getProfile };
