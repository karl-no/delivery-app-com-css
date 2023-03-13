require('dotenv').config();
const fs = require('fs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const userService = require('../service/user.service');

const jwtKey = fs.readFileSync('jwt.evaluation.key');

const jwtConfig = { algorithm: 'HS256', expiresIn: '1d' };

const login = async (req, res) => {
  const { email, password } = req.body;
  const encryptPassword = md5(password);
  const user = await userService.getUserByEmail(email);
  if (!user || encryptPassword !== user.password) {
    return res.status(404).json({ message: 'Invalid fields' });
  }
  const token = jwt.sign({ data: { email, name: user.name, role: user.role } }, jwtKey, jwtConfig);
  return res.status(200).json({ token });
};

const createUser = async (req, res) => {
  const user = req.body;
  const newUser = await userService.createUser(user);
  if (!newUser) return res.status(409).json({ message: 'User already registered' });
  return res.status(201).json(newUser);
};

const admCreateUser = async (req, res) => {
  const user = req.body;
  const newUser = await userService.admCreateUser(user);
  if (!newUser) return res.status(409).json({ message: 'User already registered' });
  return res.status(201).json(newUser);
};

const getSellers = async (_req, res) => {
  try {
    const seller = await userService.getSellers();
    return res.status(200).json(seller);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  if (!user) return res.status(404).json({ message: 'User does not exist' });
  return res.status(200).json(user);
};

const getAll = async (_req, res) => {
  try {
    const user = await userService.getAll();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);
    console.log(deletedUser);
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  login,
  createUser,
  getSellers,
  getUserById,
  getAll,
  admCreateUser,
  deleteUser,
};
