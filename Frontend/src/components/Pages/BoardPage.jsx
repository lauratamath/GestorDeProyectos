import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getProjects, getCurrentUser } from '../../services/api'; 
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

  return (
    <div className="p-6 bg-base-100 min-h-screen font-inter">
      <div className="flex items-center justify-between mb-3">
        <div>
          <button
            onClick={() => navigate('/dashboard')} // Navega al dashboard
            className="px-0 pb-2  text-c-Orange hover:text-c-Orange2 textarea-md leading-none font-normal hover:font-medium"
          >
            ← regresar
          </button>
          <h1 className="text-c-Blue text-3xl font-bold">{project.name}</h1>
          <p className="text-c-Blue textarea-md font-bold p-0">{project.description}</p>
        </div>
        <div className="text-lg text-c-Blue font-medium">
          Hola,{' '}
          <span className="font-semibold text-c-Orange hover:text-c-Orange2">
            {userName || 'Usuario'}
          </span>
          !
        </div>
      </div>
      
      <div className="mt-6">
        <Board selectedProject={projectId} />
      </div>
    </div>
  );
};

export default BoardPage;
////////////////////////////////////