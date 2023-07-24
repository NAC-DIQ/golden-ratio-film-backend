const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token
  const token = req.header('token');

  //   Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization denied' });
  }

  //   verify token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is invalid' });
  }
};
