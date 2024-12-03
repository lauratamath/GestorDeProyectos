import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { getProjects, getCurrentUser, deleteProject } from '../../services/api'; // Asegúrate de importar getCurrentUser
import Board from '../Kanban/Board';

const BoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate(); // Para la navegación
  const [project, setProject] = useState(null);
  const [userName, setUserName] = useState(''); // Estado para el nombre del usuario

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticación no encontrado');
      return;
    }

    const fetchData = async () => {
      try {
        // Obtener proyecto
        const response = await getProjects(token);
        const foundProject = response.data.find((proj) => proj._id === projectId);
        setProject(foundProject);

        // Obtener nombre del usuario
        const userResponse = await getCurrentUser(token);
        setUserName(userResponse.data.name);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, [projectId]);

  if (!project) {
    return <p className="text-center">Cargando proyecto...</p>;
  }

  const handleDeleteProject = async () => {
    const token = localStorage.getItem('token');
    try {
      await deleteProject(projectId, token);
      navigate('/dashboard'); // Redirige después de eliminar
    } catch (err) {
      console.error('Error eliminando el proyecto:', err);
    }
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen font-inter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-c-Blue text-3xl font-bold">{project.name}</h1>
        <div className="text-lg text-c-Blue font-medium">
          Hola,{' '}
          <span className="font-semibold text-c-Orange hover:text-c-Orange2">
            {userName || 'Usuario'}
          </span>
          !
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard')} // Navega al dashboard
        className="px-4 py-2 bg-c-Orange text-white rounded hover:bg-c-Orange2"
      >
        Regresar
      </button>
      <div className="mt-6">
        <Board selectedProject={projectId} />
      </div>
      

        <button
        onClick={handleDeleteProject}
        className="btn text-white bg-c-Orange hover:bg-c-Orange2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-c-Orange"
        >
        Eliminar Proyecto
        </button>
    </div>
  );
};

export default BoardPage;
