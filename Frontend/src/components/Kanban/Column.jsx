import React from 'react';
import Card from './Card';

const Column = ({ title }) => {
    const tasks = []; // Por ahora vacío, luego será dinámico.

    return (
        <div style={{ border: '1px solid black', padding: '10px', width: '300px' }}>
            <h2>{title}</h2>
            {tasks.map((task) => (
                <Card key={task.id} task={task} />
            ))}
        </div>
    );
};

export default Column;
