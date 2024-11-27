// frontend/components/Kanban/Column.jsx
import React from 'react';
import Card from './Card';

const Column = ({ status, tasks, onStatusChange }) => {
    return (
        <div className="column">
            <h2>{status}</h2>
            {tasks.map(task => (
                <Card key={task._id} task={task} onStatusChange={onStatusChange} />
            ))}
        </div>
    );
};

export default Column;
