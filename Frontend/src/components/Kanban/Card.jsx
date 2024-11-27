import React from 'react';

const Card = ({ task, onStatusChange }) => {
    return (
        <div className="card bg-base-100 shadow-xl p-4 rounded-lg mb-4">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600 mb-4">{task.description}</p>
            
            {/* Dropdown para seleccionar el estado de la tarea */}
            <div className="dropdown">
                <button className="btn btn-outline w-full text-left">
                    {task.status || 'Seleccionar estado'}
                </button>
                <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full">
                    <li>
                        <button
                            onClick={() => onStatusChange(task._id, 'Por hacer')}
                            className="btn btn-ghost w-full text-left"
                        >
                            Por hacer
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onStatusChange(task._id, 'En curso')}
                            className="btn btn-ghost w-full text-left"
                        >
                            En curso
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => onStatusChange(task._id, 'Finalizada')}
                            className="btn btn-ghost w-full text-left"
                        >
                            Finalizada
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Card;
