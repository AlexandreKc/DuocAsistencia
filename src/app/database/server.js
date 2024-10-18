// Importación mysql2 - Revisar 2_Anotaciones para instalación 
const mysql = require('mysql2');

// Conexión a mysql - Modificar los datos según la configuración local de mysql workbench
const connection = mysql.createConnection({
  host: 'localhost',        // Dirección del servidor MySQL (por defecto es localhost)
  user: 'root',             // Tu usuario de MySQL Workbench
  password: '1111',         // Tu contraseña de MySQL
  database: 'PlayTab'       // El nombre de la base de datos que quieres conectar
});

// Establecer la conexión con MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.stack);
    return;
  }
  console.log('Conectado a MySQL con ID de conexión:', connection.threadId);
});

// consulta de ejemplo
connection.query('SELECT * FROM USUARIO', (err, results, fields) => {
  if (err) {
    console.error('Error en la consulta:', err.stack);
    return;
  }
  console.log('Resultados:', results);
});

// Cerrar la conexión
connection.end();