const express = require('express');
const router = express.Router();

// Aquí debes agregar las rutas para las tareas
router.post('/', (req, res) => {
    // Lógica para crear una tarea
    res.send('Crear tarea');
});

router.get('/', (req, res) => {
    // Lógica para obtener todas las tareas
    res.send('Obtener tareas');
});

module.exports = router;
