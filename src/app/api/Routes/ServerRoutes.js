const express = require('express');
const router = express.Router();
const { serverStatus } = require('../Controllers/serverController');

router.get('/server', serverStatus);

module.exports = router;
