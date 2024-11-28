import React, { useState, useEffect } from 'react';
import { createProject, getProjects, getCurrentUser, deleteProject  } from '../../services/api';
import Board from '../Kanban/Board';
import logo from '../images/logo2.png';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [selectedProject, setSelectedProject] = useState(null);
    const [userName, setUserName] = useState(''); // Estado para almacenar el nombre del usuario

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Obtener los proyectos
        getProjects(token).then(response => setProjects(response.data));

        // Obtener los datos del usuario
        getCurrentUser(token)
            .then(response => setUserName(response.data.name)) 
            .catch(err => console.error('Error al obtener el usuario:', err));
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await createProject(newProject.name, newProject.description, token);
            const createdProject = response.data;

            setProjects([...projects, createdProject]);
            setNewProject({ name: '', description: '' });
            setSelectedProject(createdProject._id);
        } catch (err) {
            console.error('Error creando el proyecto:', err);
        }
    };

    const handleDeleteProject = async () => {
        if (selectedProject) {
            const token = localStorage.getItem('token');
            try {
                const response = await deleteProject(selectedProject, token); // Llamada a la función deleteProject
                console.log('Proyecto eliminado', response.data); // Verifica la respuesta del servidor
    
                // Actualizar la lista de proyectos y desmarcar el proyecto seleccionado
                setProjects(projects.filter(project => project._id !== selectedProject));
                setSelectedProject(null); // Desmarcar el proyecto seleccionado
            } catch (err) {
                console.error('Error eliminando el proyecto:', err);
            }
        }
    };
    
    

    return (
        <div className="p-6 bg-base-100 min-h-screen font-inter">
            {/* Encabezado */}
            <div className="flex items-center justify-between mt-5 mb-1">
                <div className="flex items-center">
                    <img src={logo} alt="cover" className="h-loginImg-H md:h-logoDash-H" />
                    <h1 className="text-c-Blue ml-3 md:text-4xl text-lg font-bold mb-8">
                        Tablero Kanban
                    </h1>
                </div>
                <div className="flex md:text-2xl text-lg text-c-Blue font-medium text-center">
                        Hola,{' '}
                        <p className="font-semibold ml-1 text-c-Orange hover:text-c-Orange2">
                            {userName || 'Usuario'}
                        </p>
                        !
                </div>
            </div>
            <hr className='bg-c-Orange2 mb-5 h-1'/>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulario para crear un proyecto */}
                <div className="bg-c-Grey p-6 rounded-lg shadow-lg">
                    <h2 className="md:text-2xl text-lg font-semibold  text-c-Blue mb-4">Crear un Proyecto</h2>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre del Proyecto"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            className="input input-bordered w-full md:text-base text-sm"
                            required
                        />
                        <textarea
                            placeholder="Descripción del Proyecto"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            className="textarea textarea-bordered w-full md:text-base text-sm"
                        />
                        <button type="submit" className="btn btn-primary bg-c-Orange hover:bg-c-Orange2 text-white w-full outline-none border-transparent hover:border-transparent">
                            Crear Proyecto
                        </button>
                    </form>
                </div>

                {/* Dropdown para seleccionar un proyecto */}
                <div className="p-6 rounded-lg shadow-lg  bg-c-Grey">
                    <h2 className="md:text-2xl text-lg font-semibold  text-c-Blue mb-4">Selecciona un Proyecto</h2>
                    <select
                        value={selectedProject || ''}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled >-- Selecciona un proyecto --</option>
                        {projects.map(project => (
                            <option key={project._id} value={project._id} className='hover:bg-c-Orange'>
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
                <div className="mt-8 text-center text-xl text-gray-200">
                    Selecciona un proyecto para visualizar las tareas.
                </div>
            )}

            {selectedProject && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleDeleteProject}
                        className="btn text-white bg-c-Orange hover:bg-c-Orange2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-c-Orange"
                    >
                        Eliminar Proyecto
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
