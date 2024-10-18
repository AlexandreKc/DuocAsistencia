// Importación de los módulos necesarios
const express = require('express');
const cors = require('cors'); // Importar CORS
const mysql = require('mysql2');

// Crear una instancia de Express
const app = express();
const PORT = 3000; // Puedes usar el puerto que prefieras

// Middleware para permitir CORS y parsear el cuerpo de las solicitudes en formato JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',        // Dirección del servidor MySQL (por defecto es localhost)
  user: 'root',             // Tu usuario de MySQL Workbench
  password: '1111',         // Tu contraseña de MySQL
  database: 'duocasistencia' // El nombre de la base de datos que quieres conectar
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
  console.log('Datos recibidos:', req.body); // Verificar qué datos se reciben

  if (!correo || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona correo y contraseña' });
  }

  const query = 'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?';
  connection.query(query, [correo, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.stack);
      return res.status(500).json({ message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      res.json({ valid: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ valid: false, message: 'Correo o contraseña incorrectos' });
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
