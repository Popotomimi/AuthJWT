import jwt from 'jsonwebtoken';

const createUserToken = async (user) => {
  const token = jwt.sing(
    {
      name: user.name,
      id: user._id,
    },
    'popoto100200300',
  );

  return { message: 'Você está autenticado', token: token, id: user._id };
};

module.exports = createUserToken;
