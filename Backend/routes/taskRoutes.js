// backend/routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Crear una tarea
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate, projectId } = req.body;
    try {
        const task = new Task({
            title,
            description,
            dueDate,
            projectId,
            assignedTo: req.user.id, // Asignar la tarea al usuario autenticado
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la tarea', details: err.message });
    }
});

// Obtener todas las tareas de un proyecto
router.get('/:projectId', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las tareas', details: err.message });
    }
});

// Actualizar el estado de la tarea
router.put('/:taskId', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { status: req.body.status },
            { new: true }
        );
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la tarea', details: err.message });
    }
});

module.exports = router;
