const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Corrige para pegar o token corretamente
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Armazena o ID do usuário decodificado
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = auth;
