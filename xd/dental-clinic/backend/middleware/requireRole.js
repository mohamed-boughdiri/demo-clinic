/**
 * Requires an authenticated request (run after `auth` middleware).
 * @param {string[]} allowedRoles - e.g. ['patient'], ['doctor'], ['receptionist'], ['admin']
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.userRole;
    if (!role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (allowedRoles.includes(role)) {
      return next();
    }
    // Solo practice: admin with a linked dentist profile can use doctor routes.
    if (allowedRoles.includes('doctor') && role === 'admin' && req.dentistId) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
}
