const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Acesso negado' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

module.exports = adminAuth;
