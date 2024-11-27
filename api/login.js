const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona correo y contraseña' });
    }

    // Conectar a la base de datos (usar las variables de entorno)
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    connection.query('SELECT nombre, id_tp_usuario, contrasena FROM usuario WHERE correo = ?', [correo], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err.stack);
        return res.status(500).send('Error en la consulta');
      }

      if (results.length > 0) {
        bcrypt.compare(password, results[0].contrasena, (err, isMatch) => {
          if (err) {
            console.error('Error al comparar las contraseñas:', err.stack);
            return res.status(500).send('Error al comparar las contraseñas');
          }

          if (isMatch) {
            return res.json({
              valid: true,
              nombre: results[0].nombre,
              id_tp_usuario: results[0].id_tp_usuario
            });
          } else {
            return res.json({ valid: false, message: 'Contraseña incorrecta' });
          }
        });
      } else {
        return res.json({ valid: false, message: 'Usuario no encontrado' });
      }
    });
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
};
