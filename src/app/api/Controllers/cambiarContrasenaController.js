const bcrypt = require('bcryptjs');
const pool = require('../db');

const cambiarContrasena = async (req, res) => {
  const { correo, nuevaContrasena } = req.body;

  if (!correo || !nuevaContrasena) {
    return res.status(400).json({ message: 'Por favor, proporciona correo y nueva contraseña.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const query = 'UPDATE usuario SET contrasena = ? WHERE correo = ?';

    pool.query(query, [hashedPassword, correo], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err.stack);
        return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
      }

      if (results.affectedRows > 0) {
        res.json({ message: 'Contraseña cambiada exitosamente.' });
      } else {
        res.status(404).json({ message: 'Correo no registrado.' });
      }
    });
  } catch (error) {
    console.error('Error al encriptar la nueva contraseña:', error.stack);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
};

module.exports = { cambiarContrasena };
