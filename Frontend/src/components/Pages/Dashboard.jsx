import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, getProjects, getCurrentUser, getUsers } from '../../services/api';
import { useAuth } from '../hooks/useAuth';
import logo from '../images/logo2.png';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [userName, setUserName] = useState('');
    const [users, setUsers] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticación no encontrado');
            return;
        }
        
        const fetchData = async () => {
            try {
                const [projectsRes, userRes, usersRes] = await Promise.all([
                    getProjects(token),
                    getCurrentUser(token),
                    getUsers(token)
                ]);
                
                setProjects(projectsRes.data);
                setUserName(userRes.data.name);
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Error al cargar datos:', err);
            }
        };

        fetchData();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await createProject({
                name: newProject.name,
                description: newProject.description,
                members: selectedMembers
            }, token);

            setProjects([...projects, response.data]);
            setNewProject({ name: '', description: '' });
            setSelectedMembers([]);
        } catch (err) {
            console.error('Error creando el proyecto:', err);
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
                <div className='flex flex-col items-start '>
                    <div className="flex md:text-2xl text-lg text-c-Blue font-medium text-center">
                            Hola,{' '}
                            <p className="font-semibold ml-1 text-c-Orange hover:text-c-Orange2">
                                {userName || 'Usuario'}
                            </p>
                            !
                    </div>
                    <button onClick={logout} className="px-0 py-1 text-xs text-c-Orange hover:text-c-Orange2 bg-transparent rounded"> Cerrar Sesión </button>
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

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Seleccionar Miembros</span>
                            </label>
                            <select
                                multiple
                                value={selectedMembers}
                                onChange={(e) =>
                                    setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))
                                }
                                className="select select-bordered w-full h-32"
                            >
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                                </option>
                            ))}
                            </select>
                        </div>
                        <button type="submit" className="btn bg-c-Orange outline-0 hover:bg-c-Orange2 text-white w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-c-Orange border-transparent">
                            Crear Proyecto
                        </button>
            </form>
        </div>

        <div className="p-6 rounded-lg shadow-lg bg-c-Grey">
            <h2 className="md:text-2xl text-lg font-semibold text-c-Blue mb-4">Selecciona un Proyecto</h2>
            <select
            onChange={(e) => {
                const projectId = e.target.value;
                if (projectId) navigate(`/project/${projectId}`);
            }}
            className="select select-bordered w-full"
            >
            <option value="" disabled>
                -- Selecciona un proyecto --
            </option>
            {projects.map((project) => (
                <option key={project._id} value={project._id}>
                {project.name}
                </option>
            ))}
            </select>
        </div>
        </div>
    </div>
    );
    };

    export default Dashboard;
