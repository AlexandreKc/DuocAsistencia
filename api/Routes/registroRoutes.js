const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../Controllers/registroController');

router.post('/registro', registrarUsuario);

module.exports = router;
