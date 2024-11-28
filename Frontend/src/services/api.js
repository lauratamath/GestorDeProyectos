import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear proyecto
export const createProject = async (name, description, token) => {
    return await axios.post(`${API_URL}/projects`, { name, description }, {
        headers: { 'x-auth-token': token },
    });
};

// Obtener proyectos
export const getProjects = async (token) => {
    return await axios.get(`${API_URL}/projects`, {
        headers: { 'x-auth-token': token },
    });
};

// Crear tarea
export const createTask = async (title, description, dueDate, projectId, assignedTo, token) => {
    return await axios.post(`${API_URL}/tasks`, { title, description, dueDate, projectId, assignedTo }, {
        headers: { 'x-auth-token': token },
    });
};


// Obtener tareas de un proyecto
export const getTasks = async (projectId, token) => {
    return await axios.get(`${API_URL}/tasks/${projectId}`, {
        headers: { 'x-auth-token': token },
    });
};

// Actualizar estado de la tarea
export const updateTaskStatus = async (taskId, status, token) => {
    return await axios.put(`${API_URL}/tasks/${taskId}`, { status }, {
        headers: { 'x-auth-token': token },
    });
};

//Cambios de la tarea
// Actualizar tarea
export const updateTask = async (taskId, updatedData, token) => {
    return await axios.put(`${API_URL}/tasks/${taskId}`, updatedData, {
        headers: { 'x-auth-token': token },
    });
};


// Asignar tarea a un usuario
export const assignTaskToUser = async (taskId, assignedTo, token) => {
    return await axios.put(`${API_URL}/tasks/${taskId}`, { assignedTo }, {
        headers: { 'x-auth-token': token },
    });
};

// Eliminar tarea
export const deleteTask = async (taskId, token) => {
    return await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { 'x-auth-token': token }
    });
};


// Actualizar proyecto
export const updateProject = async (projectId, name, description, token) => {
    return await axios.put(`${API_URL}/projects/${projectId}`, { name, description }, {
        headers: { 'x-auth-token': token },
    });
};

// Eliminar proyecto
// services/api.js
export const deleteProject = async (projectId, token) => {
    return await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: { 'x-auth-token': token }
    });
};


// Obtener usuarios
export const getUsers = async (token) => {
    return await axios.get(`${API_URL}/users`, {
        headers: { 'x-auth-token': token },
    });
};

// Obtener datos del usuario autenticado
export const getCurrentUser = async (token) => {
    return await axios.get(`${API_URL}/auth/me`, { // Cambia '/auth/me' si el endpoint es diferente
        headers: { 'x-auth-token': token },
    });
};

