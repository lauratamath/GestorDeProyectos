import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTasks,  createTask, updateTaskStatus, deleteTask, updateTask, getProjectMembers, deleteProject } from '../../services/api';
import Column from './Column';
import TaskModal from './TaskModal'; 

const Board = ({ selectedProject }) => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]); // Miembros del proyecto
    const [errorMessage, setErrorMessage] = useState("")
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
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setErrorMessage("Ups! No cuentas con los permisos para eliminar el proyecto");
            } else {
                console.error('Error eliminando el proyecto:', err);
            }
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
                console.log('Tarea actualizada:', response.data); // Verifica el assignedTo actualizado
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
                    className="max-w-fit flex align-middle justify-center py-2 px-2 border border-transparent text-xs font-medium rounded-md bg-white text-c-Orange hover:text-c-Orange2 hover:bg-gray-100"
                >
                    Eliminar Proyecto
                </button>
            </div>

            {errorMessage && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/4 text-center">
                        <p className="text-lg font-semibold text-c-error">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage("")}
                            className="mt-4 bg-c-Orange text-white py-2 px-4 rounded-md hover:bg-c-Orange2"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            
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
                        projectMembers={projectMembers}
                    />
                ))}
            </div>
        </div>
    )
}

export default Board;
