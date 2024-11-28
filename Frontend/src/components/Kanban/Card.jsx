import React, { useState } from 'react';
import { updateTask, deleteTask } from '../../services/api'; // Asegúrate de importar las funciones para editar y eliminar tareas

const Card = ({ task, onStatusChange, onDeleteTask, onEditTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prevTask => ({ ...prevTask, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Aquí guardamos los cambios
        onEditTask(editedTask);
        setIsEditing(false); // Salimos del modo de edición
    };

    return (
        <div className="card p-4 shadow-md rounded-md mb-4">
            {!isEditing ? (
                <>
                    <h3 className="font-semibold text-xl">{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Fecha de vencimiento: {task.dueDate}</p>

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
                                className="btn btn-secondary btn-sm"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onDeleteTask(task._id)}
                                className="btn btn-error btn-sm"
                            >
                                Eliminar
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
                            className="btn btn-primary"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-secondary"
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
