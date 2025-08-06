const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
  return res.status(400).json({ msg: 'Faltan datos' });
  }

  try {
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const nuevoUsuario = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });

    await nuevoUsuario.save();

    const payload = { id: nuevoUsuario.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({
      msg: 'Usuario registrado correctamente',
      token
    });

  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar usuario', error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Faltan datos' });
  }

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    const payload = { id: usuario.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({
      msg: 'Login exitoso',
      token,
      user: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email
        }
    });

  } catch (error) {
    res.status(500).json({ msg: 'Error al iniciar sesión', error: error.message });
  }
};

