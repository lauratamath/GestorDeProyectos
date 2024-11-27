import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            // Aquí puedes agregar la redirección a la página que desees después del login
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
            console.error('Error:', err.response?.data);
        }
    };

    return (
        <div>
            <div>
                <div>
                    <h2>
                        Iniciar Sesión
                    </h2>
                </div>
                <form onSubmit={onSubmit}>
                    {error && (
                        <div>
                            {error}
                        </div>
                    )}
                    <div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Contraseña"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;