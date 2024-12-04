const Project = require('../models/Project');
const User = require('../models/User');

const projectController = {
    createProject: async (req, res) => {
        const { name, description, members } = req.body;
        try {
            const project = new Project({
                name,
                description,
                userId: req.user.id,
                members: members || [],
            });
            await project.save();
            res.status(201).json(project);
        } catch (err) {
            res.status(500).json({ error: 'Error al crear el proyecto', details: err.message });
        }
    },

    getAllProjects: async (req, res) => {
        try {
            const projects = await Project.find({
                $or: [
                    { userId: req.user.id },
                    { members: req.user.id }
                ]
            }).populate('members', 'name email');
            res.json(projects);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener los proyectos', details: err.message });
        }
    },

    updateProject: async (req, res) => {
        const { name, description } = req.body;
        try {
            const project = await Project.findOneAndUpdate(
                { _id: req.params.projectId, userId: req.user.id },
                { name, description },
                { new: true }
            );
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar el proyecto', details: err.message });
        }
    },

    deleteProject: async (req, res) => {
        try {
            const project = await Project.findOneAndDelete({
                _id: req.params.projectId,
                userId: req.user.id,
            });
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            res.json({ message: 'Proyecto eliminado con éxito' });
        } catch (err) {
            res.status(500).json({ error: 'Error al eliminar el proyecto', details: err.message });
        }
    },

    getAvailableUsers: async (req, res) => {
        try {
            const users = await User.find({
                _id: { $ne: req.user.id }
            }).select('name email');
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
        }
    },

    updateProjectMembers: async (req, res) => {
        const { members } = req.body;
        try {
            const project = await Project.findOneAndUpdate(
                { 
                    _id: req.params.projectId,
                    userId: req.user.id 
                },
                { members },
                { new: true }
            ).populate('members', 'name email');
            
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: 'Error al actualizar los miembros', details: err.message });
        }
    }
};

module.exports = projectController;