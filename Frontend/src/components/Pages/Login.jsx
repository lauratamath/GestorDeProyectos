import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../images/logo.png'

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
            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                console.log('Error de respuesta:', err.response); // Esto ayudará a ver todo el objeto de respuesta
                setError(err.response.data.error || 'Error al iniciar sesión');
            } else {
                setError('Error al conectar con el servidor');
            }
        }
    };

    return (
        <div className="font-inter bg-login-background flex flex-col justify-center px-6 py-12 md:px-8 p-6 bg-base-100 min-h-screen">
            <div className=" bg-white p-6 gap-0 rounded-custom flex flex-col justify-center items-center md:w-whiteBox-W w-full md:h-whiteBox-H shadow-custom mx-auto">
                <img src={logo} alt="cover" className='max-auto md:h-loginImg-H h-20 w-auto'  />
                <div className="mt-6 md:mx-auto md:w-72 space-y-10 w-full">
                    <form onSubmit={onSubmit}>
                        <div>
                            <div className="mb-2 mt-8">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={onChange}
                                    className="border p-2 text-sm mb-0 w-full bg-white rounded-md py-1.5 text-c-Blue shadow-sm focus:ring-c-Orange focus:ring-1 focus:outline-none focus:shadow-inputLogin"
                                />
                            </div>
                            <div className="mt-2 mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={onChange}
                                    className="border p-2 text-sm mb-0 w-full bg-white rounded-md py-1.5 text-c-Blue shadow-sm focus:ring-c-Orange focus:ring-1 focus:outline-none focus:shadow-inputLogin"
                                />
                            </div>
                            {error && (
                                <div className="text-xs font-medium text-c-error mb-5">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-c-Orange hover:bg-c-Orange2"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                </div>
                <div className="text-center">
                    <p className="mt-2 text-sm text-c-Blue">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="font-medium text-c-Orange hover:text-c-Orange2 hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
