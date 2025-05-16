const jwt = require('jsonwebtoken');

function generateToken(adminId) {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
}

module.exports = generateToken;
