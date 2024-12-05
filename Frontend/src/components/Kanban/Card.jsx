import { useState } from 'react';
//import { updateTask, deleteTask } from '../../services/api'; 
import edit from '../images/edit.png'
import deleteIcon from '../images/closed.png'
import delete2 from '../images/open.png'

const Card = ({ task, onStatusChange, onDeleteTask, onEditTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [hoveringDelete, setHoveringDelete] = useState(false);

    // Vencimiento de fecha
    const isOverdue = new Date(task.dueDate) < new Date();

    // Asignamos las clases dependiendo si está vencida o no, pero solo si no está finalizada
    const cardClasses = task.status === "Finalizada" 
        ? "card p-4 shadow-md rounded-md mt-1 mb-4 static static" // Color normal si está finalizada
        : isOverdue
        ? "card p-4 shadow-md rounded-md mt-1 mb-4 text-c-error static" // Rojo si está vencida y no finalizada
        : "card p-4 shadow-md rounded-md mt-1 mb-4 static"; // Color normal si no está vencida

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Guardar los cambios
        onEditTask(editedTask);
        setIsEditing(false); // Salimos del modo de edición
    };

    return (
        <div className={cardClasses}>
            {!isEditing ? (
                <>
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Fecha de vencimiento: {new Date(task.dueDate).toLocaleDateString()}</p>

                    <div className="flex justify-between items-center mt-4">
                        <select
                            value={task.status}
                            onChange={(e) => onStatusChange(task._id, e.target.value)}
                            className="select select-bordered w-1/3"
                        >
                            <option value="Por hacer">Por hacer</option>
                            <option value="En curso">En curso</option>
                            <option value="Finalizada">Finalizada</option>
                        </select>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn hover:bg-slate-50 btn-secondary btn-sm outline-none border-transparent bg-transparent hover:border-transparent"
                            >
                                <img src={edit} alt="Editar" className="w-6 h-6 hover:opacity-90" />
                            </button>
                            <button
                                onMouseEnter={() => setHoveringDelete(true)}
                                onMouseLeave={() => setHoveringDelete(false)}
                                onClick={() => onDeleteTask(task._id)}
                                className="btn btn-error btn-sm p-2 hover:bg-slate-50 flex items-center justify-center content-end outline-none border-transparent bg-transparent hover:border-transparent"
                            >
                                <img src={hoveringDelete ? delete2 : deleteIcon} alt="Eliminar" className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        name="title"
                        value={editedTask.title}
                        onChange={handleChange}
                        className="input input-bordered w-full mb-2"
                    />
                    <textarea
                        name="description"
                        value={editedTask.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full mb-2"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={editedTask.dueDate}
                        onChange={handleChange}
                        className="input input-bordered w-full mb-2"
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleSaveChanges}
                            className="btn justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-c-Orange hover:bg-c-Orange2 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-c-Orange"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md  bg-white text-c-Orange hover:text-c-Orange2 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Card;
