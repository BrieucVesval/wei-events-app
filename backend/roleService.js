const { UserRole, Role } = require('./database');

async function getUserRole(userId) {
  const userRole = await UserRole.findOne({
    where: { userId },
    include: [Role]
  });

  return userRole ? userRole.Role.name : null;
}

module.exports = { getUserRole };
