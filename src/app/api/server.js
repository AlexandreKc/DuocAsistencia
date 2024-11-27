// Modulos necesarios
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Instancia express
const app = express();
const PORT = process.env.PORT || 3000;

// Para realizar consultas sin importar el port
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Establecer la conexión con MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
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
});

// Endpoint para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  
  // Validaciones de entrada
  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Añadir la lógica para guardar el nuevo usuario en la base de datos
    const query = 'INSERT INTO usuario (correo, nombre, contrasena, id_tp_usuario) VALUES (?, ?, ?, 1)'; // id_tp_usuario por defecto es 1
    connection.query(query, [correo, nombre, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Correo ya registrado, recupera tu contraseña' });
      }
      res.status(201).json({ message: 'Usuario registrado con éxito.' });
    });
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para verificar si el correo existe
app.post('/validar-correo', (req, res) => {
  const { correo } = req.body; // Obtener el correo del cuerpo de la solicitud
  
  // Consulta a la base de datos
  const query = 'SELECT * FROM usuario WHERE correo = ?';
  connection.query(query, [correo], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      if (results.length > 0) {
        res.json({ existe: true });
      } else {
        res.json({ existe: false });
      }
    }
  });
});

// Ruta para cambiar la contraseña
app.post('/cambiar-contrasena', (req, res) => {
  const { correo, nuevaContrasena } = req.body;

  // Verificar que se proporcionaron el correo y la nueva contraseña
  if (!correo || !nuevaContrasena) {
    return res.status(400).json({ message: 'Por favor, proporciona el correo y la nueva contraseña' });
  }

  // Encriptar la nueva contraseña
  bcrypt.hash(nuevaContrasena, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error al encriptar la nueva contraseña:', err.stack);
      return res.status(500).json({ message: 'Error al encriptar la contraseña' });
    }

    // Consulta para actualizar la contraseña
    const query = 'UPDATE usuario SET contrasena = ? WHERE correo = ?';
    connection.query(query, [hashedPassword, correo], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err.stack);
        return res.status(500).json({ message: 'Error al cambiar la contraseña' });
      }

      if (results.affectedRows > 0) {
        // Si se actualizó la contraseña
        res.json({ message: 'Contraseña cambiada exitosamente' });
      } else {
        // Si no se encontró el usuario
        res.status(404).json({ message: 'Correo no registrado' });
      }
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
