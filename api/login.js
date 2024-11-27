const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Manejo del login
module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona correo y contraseña' });
    }

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
            res.json({
              valid: true,
              nombre: results[0].nombre,
              id_tp_usuario: results[0].id_tp_usuario,
            });
          } else {
            res.json({ valid: false, message: 'Contraseña incorrecta' });
          }
        });
      } else {
        res.json({ valid: false, message: 'Usuario no encontrado' });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' }); // Si la solicitud no es POST
  }
};
