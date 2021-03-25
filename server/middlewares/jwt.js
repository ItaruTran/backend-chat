const jwt = require('jsonwebtoken');

const { secretKey } = require('@sv/env');

exports.checkAuth = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided' });
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.userId = Number(decoded.sub);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
