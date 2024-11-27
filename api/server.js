// Módulos necesarios
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Instancia de express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración del pool de conexiones a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
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
});

// Endpoint para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
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
});

// Ruta para verificar si el correo existe
app.post('/validar-correo', (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: 'Por favor, proporciona un correo.' });
  }

  pool.query('SELECT correo FROM usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.stack);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    res.json({ existe: results.length > 0 });
  });
});

// Ruta para cambiar la contraseña
app.post('/cambiar-contrasena', async (req, res) => {
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
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
