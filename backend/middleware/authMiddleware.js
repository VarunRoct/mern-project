const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.send("Access denied. No token provided ❌");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = verified;
    next();
  } catch (err) {
    res.send("Invalid token ❌");
  }
};

module.exports = authMiddleware;