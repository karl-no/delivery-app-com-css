const fs = require('fs');
const jwt = require('jsonwebtoken');
const userService = require('../service/user.service');
const { loginSchema } = require('./schemas');

const jwtKey = fs.readFileSync('jwt.evaluation.key');

const validateUser = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await userService.getUserByEmail(email);
  if (user) return res.status(409).json({ message: 'User already registered' });

  next();
};

const validateToken = async (req, res, next) => {
  const { authorization: token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: 'not have token' });
  }
  try {
    jwt.verify(token, jwtKey);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

const validateTokenAdm = async (req, res, next) => {
  const { authorization: token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: 'not have token' });
  }
  try {
    const decoded = jwt.verify(token, jwtKey);
    console.log(decoded);
    if (decoded.data.role !== 'administrator') {
      return res.status(401).json({ message: 'you are not authorized' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

module.exports = { validateUser, validateToken, validateTokenAdm };
