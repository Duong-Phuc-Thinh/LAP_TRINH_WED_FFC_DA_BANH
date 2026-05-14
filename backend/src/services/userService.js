const { User, Role } = require('../models');
const { hashPassword } = require('../utils/password');
const httpError = require('../utils/httpError');

const includeRoles = [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }];

async function list() {
  return User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: includeRoles,
    order: [['createdAt', 'DESC']]
  });
}

async function getById(id) {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
    include: includeRoles
  });
  if (!user) throw httpError(404, 'User not found');
  return user;
}

async function create(data) {
  const existed = await User.findOne({ where: { email: data.email } });
  if (existed) throw httpError(409, 'Email already exists');

  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    status: data.status || 'ACTIVE',
    passwordHash: await hashPassword(data.password || '123456')
  });

  await setRoles(user, data.roles || ['USER']);
  return getById(user.id);
}

async function update(id, data) {
  const user = await User.findByPk(id);
  if (!user) throw httpError(404, 'User not found');

  const updateData = {
    fullName: data.fullName ?? user.fullName,
    email: data.email ?? user.email,
    phone: data.phone ?? user.phone,
    status: data.status ?? user.status
  };

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  await user.update(updateData);
  if (data.roles) await setRoles(user, data.roles);
  return getById(id);
}

async function setRoles(user, roleNames) {
  const roles = await Role.findAll({ where: { name: roleNames } });
  if (roles.length !== roleNames.length) throw httpError(400, 'One or more roles are invalid');
  await user.setRoles(roles);
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) throw httpError(404, 'User not found');
  await user.destroy();
  return { deleted: true };
}

module.exports = { list, getById, create, update, remove };

