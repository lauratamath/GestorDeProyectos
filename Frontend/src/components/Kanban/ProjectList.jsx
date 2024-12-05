//frontend/src/components/Kanban/projectList.jsx:
import { useState, useEffect } from 'react';
import { getProjects, updateProject, deleteProject } from '../../services/api';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        getProjects(token).then(response => setProjects(response.data));
    }, []);

    const handleEdit = (project) => {
        setEditingProject(project._id);
        setNewName(project.name);
        setNewDescription(project.description);
    };

    const handleUpdate = () => {
        const token = localStorage.getItem('token');
        updateProject(editingProject, newName, newDescription, token).then(response => {
            setProjects(projects.map(project => 
                project._id === editingProject ? response.data : project
            ));
            setEditingProject(null);
        });
    };

    const handleDelete = (projectId) => {
        const token = localStorage.getItem('token');
        deleteProject(projectId, token).then(() => {
            setProjects(projects.filter(project => project._id !== projectId));
        });
    };

    return (
        <div>
            <h2>Mis Proyectos</h2>
            <ul>
                {projects.map(project => (
                    <li key={project._id}>
                        {editingProject === project._id ? (
                            <>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                                <button onClick={handleUpdate}>Guardar</button>
                                <button onClick={() => setEditingProject(null)}>Cancelar</button>
                            </>
                        ) : (
                            <>
                                <h3>{project.name}</h3>
                                <p>{project.description}</p>
                                <button onClick={() => handleEdit(project)}>Editar</button>
                                <button onClick={() => handleDelete(project._id)}>Eliminar</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
