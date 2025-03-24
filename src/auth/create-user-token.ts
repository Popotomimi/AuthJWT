import jwt = require('jsonwebtoken');
import * as dotenv from 'dotenv';

dotenv.config();

const createUserToken = async (user) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    `${process.env.SECRET}`,
  );

  return {
    message: 'Você está autenticado',
    token: token,
    id: user._id,
    name: user.name,
  };
};

module.exports = createUserToken;
