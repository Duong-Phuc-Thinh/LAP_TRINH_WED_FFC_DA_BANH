function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const isAllowed = roles.some((role) => allowedRoles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: 'You do not have permission' });
    }

    next();
  };
}

module.exports = authorizeRoles;

