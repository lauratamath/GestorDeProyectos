const Task = require('../models/Task');

const taskController = {
    createTask: async (req, res) => {
        const { title, description, dueDate, projectId, assignedTo } = req.body;
        try {
            const task = new Task({
                title,
                description,
                dueDate,
                projectId,
                assignedTo: assignedTo || req.user.id,
            });
            await task.save();
            res.status(201).json(task);
        } catch (err) {
            res.status(500).json({ error: 'Error al crear la tarea', details: err.message });
        }
    },

    getProjectTasks: async (req, res) => {
        try {
            const tasks = await Task.find({ projectId: req.params.projectId });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener las tareas', details: err.message });
        }
    },

    updateTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(
                req.params.taskId,
                { ...req.body },
                { new: true }
            );
            res.json(task);
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar la tarea', details: err.message });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.taskId);
            if (!task) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            res.json({ message: 'Tarea eliminada con éxito' });
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar la tarea', details: err.message });
        }
    }
};

module.exports = taskController;