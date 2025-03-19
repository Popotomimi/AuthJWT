import jwt from 'jsonwebtoken';

const User = require('../users/schema/user.schema');

const getUserByToken = async (token) => {
  if (!token) {
    throw new Error('Acesso negado!');
  }

  const decoded = jwt.verify(token, 'popoto100200300');

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken;
