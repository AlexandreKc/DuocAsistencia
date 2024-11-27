const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas
const authRoutes = require('./Routes/AuthRoutes');
const registroRoutes = require('./Routes/registroRoutes');
const validarCorreoRoutes = require('./Routes/validarCorreoRoutes');
const cambiarContrasenaRoutes = require('./Routes/cambiarContrasenaRoutes');
const serverRoutes = require('./routes/serverRoutes');

// Instancia de express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Usar las rutas
app.use('/api', authRoutes);
app.use('/api', registroRoutes);
app.use('/api', validarCorreoRoutes);
app.use('/api', cambiarContrasenaRoutes);
app.use('/api', serverRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});

// Exportar la aplicación para que Vercel la use
module.exports = app;
