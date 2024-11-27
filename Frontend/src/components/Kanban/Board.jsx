import React from 'react';
import Column from './Column';

const Board = () => {
    const columns = ['To Do', 'In Progress', 'Done'];

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {columns.map((column) => (
                <Column key={column} title={column} />
            ))}
        </div>
    );
};

export default Board;
