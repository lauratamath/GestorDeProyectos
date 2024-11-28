import React, { useState, useEffect } from 'react';
import { getProjects, getTasks, getUsers, createTask, updateTaskStatus, deleteTask, updateTask } from '../../services/api';
import Column from './Column';

const Board = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: ''
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        getUsers(token).then(response => setUsers(response.data));
    }, []);

    const handleColumnChange = (taskId, status) => {
        const token = localStorage.getItem('token');
        updateTaskStatus(taskId, status, token).then(response => {
            setTasks(tasks.map(task => (task._id === taskId ? response.data : task)));
        });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        createTask(newTask.title, newTask.description, newTask.dueDate, selectedProject, newTask.assignedTo, token)
            .then(response => {
                setTasks([...tasks, response.data]);
                setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
            })
            .catch(err => console.error(err));
    };

    const handleDeleteTask = (taskId) => {
        const token = localStorage.getItem('token');
        deleteTask(taskId, token)
            .then(() => {
                setTasks(tasks => tasks.filter(task => task._id !== taskId));
            })
            .catch(err => console.error(err));
    };

    const handleEditTask = (editedTask) => {
        const token = localStorage.getItem('token');
        updateTask(editedTask._id, editedTask, token)
            .then(response => {
                setTasks(tasks.map(task => (task._id === response.data._id ? response.data : task)));
            })
            .catch(err => console.error('Error al editar la tarea:', err));
    };

    return (
        <div className="p-6 bg-base-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center mb-8">Tablero de Tareas</h1>
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
                            <select
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                className="select select-bordered w-full"
                            >
                                <option value="" disabled>Asignar a</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-primary w-full">Agregar Tarea</button>
                        </form>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {['Por hacer', 'En curso', 'Finalizada'].map(status => (
                            <Column
                                key={status}
                                status={status}
                                tasks={tasks.filter(task => task.status === status)}
                                onStatusChange={handleColumnChange}
                                onDeleteTask={handleDeleteTask}
                                onEditTask={handleEditTask}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Board;
