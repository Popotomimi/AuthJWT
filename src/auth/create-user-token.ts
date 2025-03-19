import jwt from 'jsonwebtoken';

const createUserToken = async (user, req, res) => {
  const token = jwt.sing(
    {
      name: user.name,
      id: user._id,
    },
    'popoto100200300',
  );

  res.status(200).json({
    message: 'Você está Logado',
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;
