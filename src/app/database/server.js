// Importación de los módulos necesarios
const express = require('express');
const cors = require('cors'); // Importar CORS
const mysql = require('mysql2');

// Crear una instancia de Express
const app = express();
const PORT = 3000; // Puedes usar el puerto que prefieras

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
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

// Ruta de ejemplo para iniciar sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Aquí puedes agregar la lógica para verificar las credenciales del usuario
  res.json({ message: 'Login endpoint' });
});

// Ruta de ejemplo para obtener usuarios
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
