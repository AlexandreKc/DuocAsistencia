const express = require('express');
const router = express.Router();
const { cambiarContrasena } = require('../Controllers/cambiarContrasenaController');

router.post('/cambiar-contrasena', cambiarContrasena);

module.exports = router;
