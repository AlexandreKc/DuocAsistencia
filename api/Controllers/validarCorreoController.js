const pool = require('../db');

const verificarCorreo = (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ message: 'Por favor, proporciona un correo.' });
  }

  pool.query('SELECT correo FROM usuario WHERE correo = ?', [correo], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.stack);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    res.json({ existe: results.length > 0 });
  });
};

module.exports = { verificarCorreo };
