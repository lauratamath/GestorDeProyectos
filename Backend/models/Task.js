// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Por hacer', 'En curso', 'Finalizada'],
        default: 'Por hacer',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User
    },
    assignedToName: {  // Nuevo campo para almacenar el nombre del usuario
        type: String,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
