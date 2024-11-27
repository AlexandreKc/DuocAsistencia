const bcrypt = require('bcryptjs');
const pool = require('../db'); // Asegúrate de tener un archivo db.js con tu pool de conexiones

const login = (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona correo y contraseña.' });
  }

  pool.query(
    'SELECT nombre, id_tp_usuario, contrasena FROM usuario WHERE correo = ?',
    [correo],
    (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err.stack);
        return res.status(500).json({ message: 'Error en la consulta.' });
      }

      if (results.length > 0) {
        const usuario = results[0];
        bcrypt.compare(password, usuario.contrasena, (err, isMatch) => {
          if (err) {
            console.error('Error al comparar contraseñas:', err.stack);
            return res.status(500).json({ message: 'Error al procesar la contraseña.' });
          }

          if (isMatch) {
            res.json({
              valid: true,
              nombre: usuario.nombre,
              id_tp_usuario: usuario.id_tp_usuario,
            });
          } else {
            res.status(401).json({ valid: false, message: 'Contraseña incorrecta.' });
          }
        });
      } else {
        res.status(404).json({ valid: false, message: 'Usuario no encontrado.' });
      }
    }
  );
};

module.exports = { login };
