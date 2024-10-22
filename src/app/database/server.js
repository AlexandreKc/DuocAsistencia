// Modulos necesarios
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Instancia express
const app = express();
const PORT = 3000; // Modificable en caso de que no sirve el que pones
//Para realizar consultas sin importar el port
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',        // Dirección server sql
  user: 'root',             // Usuario a utilizar en mysql
  password: '1111',         // Contrasena
  database: 'duocasistencia' // Nombre de la base de datos que vas a utilizar / Revisar Script
});

// Establecer la conexión con MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.stack);
    return;
  }
  console.log('Conectado a MySQL con ID de conexión:', connection.threadId);
});

// Ruta para manejar el login
app.post('/login', (req, res) => {
  const { correo, password } = req.body;

  // Verificar que se proporcionaron el correo y la contraseña
  if (!correo || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona correo y contraseña' });
  }

  // Consulta para verificar las credenciales y obtener el nombre y el tipo de usuario
  connection.query('SELECT nombre, id_tp_usuario FROM usuario WHERE correo = ? AND contrasena = ?', [correo, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.stack);
      return res.status(500).send('Error en la consulta');
    }

    if (results.length > 0) {
      // Si el usuario existe, devolver el nombre y el id_tp_usuario
      res.json({
        valid: true,
        nombre: results[0].nombre,
        id_tp_usuario: results[0].id_tp_usuario // Incluir el tipo de usuario en la respuesta
      });
    } else {
      // Si no se encuentra el usuario, devolver respuesta inválida
      res.json({ valid: false });
    }
  });
});


// Ruta para obtener todos los usuarios (ejemplo)
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.stack);
      return res.status(500).send('Error en la consulta');
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
