import Card from './Card'
import { useDrop } from 'react-dnd'

const Column = ({ status, tasks, onStatusChange, onDeleteTask, onEditTask, projectMembers }) => {
    // Drop target
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'CARD',
        drop: (item) => {
            if (item.currentStatus !== status) {
                onStatusChange(item.id, status); // Cambia el estado de la tarea
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const columnClasses = `column md:text-base text-sm ${isOver ? 'bg-gray-200' : ''}`;

    return (
        <div ref={drop} className={columnClasses}>
            <h2>{status}</h2>
            {tasks.map(task => (
                <Card 
                    key={task._id} 
                    task={task} 
                    onStatusChange={onStatusChange} 
                    onDeleteTask={onDeleteTask} // Pasar la función de eliminación
                    onEditTask={onEditTask} 
                    projectMembers={projectMembers}
                />
            ))}
        </div>
    );
};

export default Column;
