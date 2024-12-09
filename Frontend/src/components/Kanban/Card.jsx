import { useState } from 'react'
import { useDrag } from 'react-dnd'
import edit from '../images/edit.png'
import deleteIcon from '../images/closed.png'
import delete2 from '../images/open.png'

const Card = ({ task, onStatusChange, onDeleteTask, onEditTask, projectMembers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({
        ...task,
        assignedTo: task.assignedTo || '' 
    });
    const [hoveringDelete, setHoveringDelete] = useState(false);

    // Drag source
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'CARD',
        item: { id: task._id, currentStatus: task.status }, // Datos de la tarjeta
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const cardClassesDrag = `card p-4 shadow-md rounded-md mt-1 mb-4 static ${
        isDragging ? 'opacity-50' : ''
    }`;

    // Vencimiento de fecha
    const isOverdue = new Date(task.dueDate) < new Date();

    // Asignamos las clases dependiendo si está vencida o no, pero solo si no está finalizada
    const cardClasses = task.status === "Finalizada" 
        ? "card static font-medium" // Color normal si está finalizada
        : isOverdue
        ? "card text-c-error  font-medium" // Rojo si está vencida y no finalizada
        : "card font-medium"; // Color normal si no está vencida

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
        <div ref={drag} className={cardClassesDrag}>
            {!isEditing ? (
                <>
                    <h3 className="font-bold text-lg text-c-Orange capitalize">{task.title}</h3>
                    <p className="font-medium"><strong>Descripción: </strong>{task.description}</p>
                    <p className={cardClasses}><strong>Fecha de vencimiento: </strong>{new Date(task.dueDate).toLocaleDateString()}</p>
                    <p className="font-medium capitalize"><strong>Asignada a: </strong>{task.assignedToName || 'No asignada'}</p>
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

                    <select
                        name="assignedTo"
                        value={editedTask.assignedTo}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                    >
                        <option value="" disabled>Asignar a</option>
                        {projectMembers && Array.isArray(projectMembers) ? (
                            projectMembers.map(member => (
                                <option key={member._id} value={member._id}>
                                    {member.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No hay miembros disponibles</option>
                        )}
                    </select>

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
