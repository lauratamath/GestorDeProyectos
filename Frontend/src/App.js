import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Pages/Register';
import Login from './components/Pages/Login';
import Dashboard from './components/Pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Redirige cualquier ruta no encontrada al dashboard si está autenticado, o al login si no lo está */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('token') 
              ? <Navigate to="/dashboard" replace /> 
              : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;