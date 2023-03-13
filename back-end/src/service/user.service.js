const md5 = require('md5');
const { User } = require('../database/models');

const getUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

const createUser = async ({ name, email, password }) => { 
  const role = 'customer';
  const hash = md5(password);
  const hasUser = await getUserByEmail(email);
  if (hasUser) {
    return null;
  }
  return User.create({ name, email, password: hash, role });
};

const admCreateUser = async ({ name, email, password, role = 'customer' }) => { 
  const hash = md5(password);
  const hasUser = await getUserByEmail(email);
  if (hasUser) {
    return null;
  }
  return User.create({ name, email, password: hash, role });
};

const getSellers = async () => {
  const seller = await User.findAll({
    where: { role: 'seller' },
    attributes: ['name'],
  });
  return seller;
};

const getUserById = async (id) => {
  const user = await User.findOne({ where: { id } });
  return user;
};

const deleteUser = async (id) => {
  const deletedUser = await User.destroy({ where: { id } });
  return deletedUser;
};

const getAll = async () => User.findAll();

module.exports = {
  getUserByEmail,
  createUser,
  getSellers,
  getUserById,
  getAll,
  admCreateUser,
  deleteUser,
};
