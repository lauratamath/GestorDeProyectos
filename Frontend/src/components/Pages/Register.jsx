import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', { 
                name, 
                email, 
                password 
            });
            // Redirigir al login después de un registro exitoso
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar usuario');
            console.error('Error:', err.response?.data);
        }
    };

    return (
        <div>
            <div>
                <div>
                    <h2>
                        Registrar Usuario
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
                                type="text"
                                name="name"
                                required
                                placeholder="Nombre"
                                value={name}
                                onChange={onChange}
                            />
                        </div>
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
                        >
                            Registrar
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <p>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;