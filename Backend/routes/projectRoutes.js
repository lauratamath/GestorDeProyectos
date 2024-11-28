// backend/routes/projectRoutes.js
const express = require('express');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth'); // Middleware para verificar autenticación
const router = express.Router();

// Crear un nuevo proyecto
router.post('/', authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = new Project({
            name,
            description,
            userId: req.user.id, // El ID del usuario autenticado
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el proyecto', details: err.message });
    }
});

// Obtener todos los proyectos del usuario
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los proyectos', details: err.message });
    }
});

router.put('/:projectId', authMiddleware, async (req, res) => {
    const { name, description } = req.body;
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.projectId, userId: req.user.id }, 
            { name, description },
            { new: true } // Devolver el proyecto actualizado
        );
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el proyecto', details: err.message });
    }
});

// Eliminar un proyecto
router.delete('/:projectId', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.projectId,
            userId: req.user.id, // Verificar que el usuario es dueño del proyecto
        });
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }
        res.json({ message: 'Proyecto eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el proyecto', details: err.message });
    }
});


module.exports = router;
