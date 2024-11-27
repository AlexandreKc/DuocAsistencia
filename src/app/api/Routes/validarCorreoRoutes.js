const express = require('express');
const router = express.Router();
const { verificarCorreo } = require('../Controllers/validarCorreoController');

router.post('/validar-correo', verificarCorreo);

module.exports = router;
