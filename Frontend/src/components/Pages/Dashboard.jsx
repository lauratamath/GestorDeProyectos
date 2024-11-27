import React, { useState, useEffect } from 'react';
import { createProject, getProjects } from '../../services/api';
import Board from '../Kanban/Board';
import logo from '../images/logo2.png'

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        getProjects(token).then(response => setProjects(response.data));
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await createProject(newProject.name, newProject.description, token);
            const createdProject = response.data;

            // Actualiza la lista de proyectos y selecciona el nuevo
            setProjects([...projects, createdProject]);
            setNewProject({ name: '', description: '' });
            setSelectedProject(createdProject._id); // Selecciona automáticamente el nuevo proyecto
        } catch (err) {
            console.error('Error creando el proyecto:', err);
        }
    };

    return (
        <div cclassName="p-6 bg-base-100 min-h-screen">
            <div className='flex items-center mt-7'>
                <img src={logo} alt="cover" className='max-auto md:h-loginImg-H h-20' w-auto/>
                <h1 className='text-c-Blue ml-3 text-2xl md:text-lg font-bold mb-8'>Tablero Kanban</h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario para crear un nuevo proyecto */}
                <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Crear un Proyecto</h2>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre del Proyecto"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="input input-bordered w-full"
                            required
                        />
                        <textarea
                            placeholder="Descripción del Proyecto"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="textarea textarea-bordered w-full"
                        />
                        <button type="submit" className="btn btn-primary w-full">
                            Crear Proyecto
                        </button>
                    </form>
                </div>

                {/* Dropdown para seleccionar un proyecto */}
                <div className="bg-base-200 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">Selecciona un Proyecto</h2>
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
            </div>

            {/* Mostrar el tablero solo si hay un proyecto seleccionado */}
            {selectedProject ? (
                <div className="mt-8">
                    <Board selectedProject={selectedProject} />
                </div>
            ) : (
                <div className="mt-8 text-center text-xl text-gray-500">
                    Selecciona un proyecto para visualizar las tareas.
                </div>
            )}
        </div>
    );
};

export default Dashboard;