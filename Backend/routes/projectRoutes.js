const express = require('express');
const router = express.Router();

// Aquí debes agregar las rutas para los proyectos
router.post('/', (req, res) => {
    // Lógica para crear un proyecto
    res.send('Crear proyecto');
});

router.get('/', (req, res) => {
    // Lógica para obtener todos los proyectos
    res.send('Obtener proyectos');
});

module.exports = router;
