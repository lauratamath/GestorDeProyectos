// backend/controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User');  // Asegúrate de tener acceso al modelo User

const taskController = {
    createTask: async (req, res) => {
        const { title, description, dueDate, projectId, assignedTo } = req.body;
        
        try {
            // Verificamos si el assignedTo existe
            let assignedToName = '';
            if (assignedTo) {
                const user = await User.findById(assignedTo);
                assignedToName = user ? user.name : '';
            }
            
            const task = new Task({
                title,
                description,
                dueDate,
                projectId,
                assignedTo: assignedTo || req.user.id,
                assignedToName,  // Guardar nombre de usuario
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
            const { assignedTo } = req.body;
    
            // Si assignedTo tiene un valor, obtenemos el nombre correspondiente
            let assignedToName = '';
            if (assignedTo) {
                const user = await User.findById(assignedTo);
                assignedToName = user ? user.name : '';
            }
    
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.taskId,
                { ...req.body, assignedToName },
                { new: true }
            );
    
            res.json(updatedTask);
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
    },

    onStatusChange: async (taskId, newStatus) => {
        try {
            // Actualiza localmente primero
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );
    
            // Llama al backend para actualizar el estado
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
    
            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la tarea en el servidor');
            }
    
            // Si es necesario, actualiza con la respuesta del servidor
            const updatedTask = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                )
            );
        } catch (error) {
            console.error(error.message);
        }
    
    }
    
};

module.exports = taskController;
