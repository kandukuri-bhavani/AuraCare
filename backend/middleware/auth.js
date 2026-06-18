const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isMock } = require('../config/db');
const { mockStoreHelpers } = require('../config/mockStore');

// Main auth middleware to verify JWT
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token, access denied.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforbookadoctorapplication2026');
    
    let user;
    if (isMock()) {
      user = mockStoreHelpers.findById('users', decoded.id);
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization failed.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

// Role-based authorization middleware
const authorize = (roles = []) => {
  // roles can be a single role string or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please authenticate first.' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permissions to access this action.' });
    }

    next();
  };
};

module.exports = { auth, authorize };
