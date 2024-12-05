import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { getTasks, getProjectMembers, updateTaskStatus, deleteTask, updateTask, createTask } from '../../services/api';
import { getTasks, getUsers, createTask, updateTaskStatus, deleteTask, updateTask, getProjectMembers, deleteProject  } from '../../services/api';
import Column from './Column';
import TaskModal from './TaskModal';  // Importamos el modal

const Board = ({ selectedProject }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const  setUsers = useState([]);
    const [projectMembers, setProjectMembers] = useState([]); // Nuevo estado para los miembros del proyecto
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (selectedProject) {
            const token = localStorage.getItem('token');

            // Obtener las tareas
            getTasks(selectedProject, token).then(response => setTasks(response.data));

            // Obtener los miembros del proyecto
            getProjectMembers(selectedProject, token).then(response => {
                setProjectMembers(response.data); // Almacenar los miembros del proyecto
            }).catch(err => console.error('Error al obtener los miembros del proyecto:', err));
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
                setIsModalOpen(false);
            })
            .catch(err => console.error(err));
    };

    const handleDeleteProject = async () => {
        const token = localStorage.getItem('token');
        try {
          await deleteProject(projectId, token);
          navigate('/dashboard'); // Redirige después de eliminar
        } catch (err) {
          console.error('Error eliminando el proyecto:', err);
        }
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
        <div className="py-6 px-2 bg-base-100 min-h-screen font-inter">
            <div className='flex justify-end max-h-fit mb-5'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="max-w-fit flex align-middle justify-center py-2 px-2 border mr-4 border-transparent text-xs font-medium rounded-md bg-c-Orange hover:bg-c-Orange2 text-white"
                >
                    Crear nueva tarea
                </button>

                <button
                    onClick={handleDeleteProject}
                    className="max-w-fit flex align-middle justify-center py-2 px-2 border border-transparent text-xs font-medium rounded-mdbg-white text-c-Orange hover:text-c-Orange2  hover:bg-white"
                >
                    Eliminar Proyecto
                </button>
            </div>
            
            <TaskModal 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleAddTask={handleAddTask}
                newTask={newTask}
                setNewTask={setNewTask}
                projectMembers={projectMembers}
            />

            <div className="grid grid-cols-3 font-semibold text-c-Blue md:text-2xl text-lg gap-6">
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
        </div>
    );
};

export default Board;
