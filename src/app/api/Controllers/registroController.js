const bcrypt = require('bcryptjs');
const pool = require('../db');

const registrarUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const query = 'INSERT INTO usuario (correo, nombre, contrasena, id_tp_usuario) VALUES (?, ?, ?, 1)';

    pool.query(query, [correo, nombre, hashedPassword], (err) => {
      if (err) {
        console.error('Error al registrar usuario:', err.stack);
        return res.status(409).json({ message: 'Correo ya registrado. Recupera tu contraseña.' });
      }

      res.status(201).json({ message: 'Usuario registrado con éxito.' });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error.stack);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

module.exports = { registrarUsuario };
