// frontend/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createProject = async (name, description, token) => {
    return await axios.post(`${API_URL}/projects`, { name, description }, {
        headers: { 'x-auth-token': token },
    });
};

export const getProjects = async (token) => {
    return await axios.get(`${API_URL}/projects`, {
        headers: { 'x-auth-token': token },
    });
};

export const createTask = async (title, description, dueDate, projectId, token) => {
    return await axios.post(`${API_URL}/tasks`, { title, description, dueDate, projectId }, {
        headers: { 'x-auth-token': token },
    });
};

export const getTasks = async (projectId, token) => {
    return await axios.get(`${API_URL}/tasks/${projectId}`, {
        headers: { 'x-auth-token': token },
    });
};

export const updateTaskStatus = async (taskId, status, token) => {
    return await axios.put(`${API_URL}/tasks/${taskId}`, { status }, {
        headers: { 'x-auth-token': token },
    });
};

export const updateProject = async (projectId, name, description, token) => {
    return await axios.put(`${API_URL}/projects/${projectId}`, { name, description }, {
        headers: { 'x-auth-token': token },
    });
};

export const deleteProject = async (projectId, token) => {
    return await axios.delete(`${API_URL}/projects/${projectId}`, {
        headers: { 'x-auth-token': token },
    });
};

