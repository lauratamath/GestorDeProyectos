import React, { useState, useEffect } from 'react';
import { getProjects, getTasks, createTask, updateTaskStatus } from '../../services/api';
import Column from './Column';

const Board = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        getProjects(token).then(response => setProjects(response.data));
    }, []);

    useEffect(() => {
        if (selectedProject) {
            const token = localStorage.getItem('token');
            getTasks(selectedProject, token).then(response => setTasks(response.data));
        }
    }, [selectedProject]);

    const handleColumnChange = (taskId, status) => {
        const token = localStorage.getItem('token');
        updateTaskStatus(taskId, status, token).then(response => {
            setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
        });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        createTask(newTask.title, newTask.description, newTask.dueDate, selectedProject, token)
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTask({ title: '', description: '', dueDate: '' });
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="p-6 bg-base-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Tablero de Tareas</h1>

            {/* Dropdown para seleccionar un proyecto */}
            <div className="mb-8">
                <label className="block text-lg font-semibold mb-2">Selecciona un Proyecto</label>
                <select
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>Selecciona un proyecto</option>
                    {projects.map(project => (
                        <option key={project._id} value={project._id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedProject && (
                <>
                    {/* Formulario para agregar una tarea */}
                    <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Agregar Nueva Tarea</h2>
                        <form onSubmit={handleAddTask} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Título"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="input input-bordered w-full"
                                required
                            />
                            <textarea
                                placeholder="Descripción"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="textarea textarea-bordered w-full"
                            />
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="input input-bordered w-full"
                            />
                            <button type="submit" className="btn btn-primary w-full">
                                Agregar Tarea
                            </button>
                        </form>
                    </div>

                    {/* Columnas de tareas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Por hacer', 'En curso', 'Finalizada'].map(status => (
                            <Column
                                key={status}
                                status={status}
                                tasks={tasks.filter(task => task.status === status)}
                                onStatusChange={handleColumnChange}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Board;
