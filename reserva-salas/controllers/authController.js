const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');

// Registro de Usuário
exports.register = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    // Validação de E-mail
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: 'E-mail inválido' });
    }

    // Verificação de Senha: pelo menos 8 caracteres, incluindo um número e uma letra maiúscula
    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({
        msg: 'A senha deve ter pelo menos 8 caracteres, incluindo um número e uma letra maiúscula'
      });
    }

    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    // Cria o novo usuário
    user = new User({
      name,
      email,
      password,
      role
    });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Gera o token JWT
    const payload = {
      userId: user._id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};

// Login de Usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Controlador para listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select('-password'); // Exclui a senha dos resultados
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar usuários' });
  }
};