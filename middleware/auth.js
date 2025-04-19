const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(req.headers);
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains clientId, userId, role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { authenticate };
