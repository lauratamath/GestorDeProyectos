import Card from './Card';

const Column = ({ status, tasks, onStatusChange, onDeleteTask, onEditTask }) => {
    return (
        <div className="column md:text-base text-sm">
            <h2>{status}</h2>
            {tasks.map(task => (
                <Card 
                    key={task._id} 
                    task={task} 
                    onStatusChange={onStatusChange} 
                    onDeleteTask={onDeleteTask} // Pasar la función de eliminación
                    onEditTask={onEditTask} 
                />
            ))}
        </div>
    );
};

export default Column;
