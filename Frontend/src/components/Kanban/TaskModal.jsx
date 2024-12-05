const TaskModal = ({ isModalOpen, setIsModalOpen, handleAddTask, newTask, setNewTask, projectMembers }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-semibold text-c-Blue mb-4">Agregar nueva tarea</h2>
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
                    <div className="flex justify-between align-middle sm:flex-row flex-col">
                        <button
                            type="submit"
                            className="py-2 px-2 max-w-fit flex align-middle justify-center border border-transparent text-sm font-medium rounded-md text-white bg-c-Orange hover:bg-c-Orange2 "
                        >
                            Agregar tarea
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="py-2 px-2 max-w-fit flex align-middle justify-center border border-transparent text-sm font-medium rounded-md bg-white text-c-Orange hover:text-c-Orange2  hover:bg-white"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
