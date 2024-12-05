import { useState, useEffect } from 'react';
import { getTasks, getUsers, createTask, updateTaskStatus, deleteTask, updateTask, getProjectMembers  } from '../../services/api';
import Column from './Column';

const Board = ({ selectedProject }) => {
    const [tasks, setTasks] = useState([]);
    const  setUsers = useState([]);
    const [projectMembers, setProjectMembers] = useState([]); // Nuevo estado para los miembros del proyecto
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        assignedTo: ''
    });

    useEffect(() => {
        if (selectedProject) {
            const token = localStorage.getItem('token');
            
            // Obtener las tareas
            getTasks(selectedProject, token).then(response => setTasks(response.data));
    
            // Obtener los miembros del proyecto
            getProjectMembers(selectedProject, token).then(response => {
                console.log(response.data);  // Agrega un console log aquí para ver los miembros
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
        <div className="py-6 px-2 bg-base-100 min-h-screen font-inter">
            <div className="bg-c-Grey p-6 rounded-lg shadow-lg mb-8">
                <h2 className="md:text-2xl text-lg font-semibold  text-c-Blue mb-4">Agregar nueva tarea</h2>
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
                        {projectMembers.map(member => (
                            <option key={member._id} value={member._id}>{member.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary bg-c-Orange hover:bg-c-Orange2 text-white w-full outline-none border-transparent hover:border-transparent">Agregar tarea</button>
                </form>
            </div>

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
