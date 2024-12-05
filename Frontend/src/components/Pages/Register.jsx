import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo.png'


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { name, email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage(''); 

        try {
            await axios.post('http://localhost:5000/api/auth/register', { 
                name, 
                email, 
                password 
            });
            setSuccessMessage('¡Cuenta creada con éxito! Te redirigiremos a la pantalla de login.');
            
            setTimeout(() => {
                navigate('/'); 
            }, 7000); // 7 segundos
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar usuario REGISTER');
            console.error('Error:', err.response?.data);
        }
    };

    return (
        <div className="font-inter bg-login-background flex min-h-full flex-col justify-center px-6 py-12 md:px-8">
            <div className=" bg-white p-6 gap-0 rounded-custom flex flex-col justify-center items-center md:w-whiteBox-W w-full md:h-whiteBox-H shadow-custom mx-auto">
                <img src={logo} alt="cover" className='max-auto md:h-loginImg-H h-20' w-auto/>
                <div class="mt-6 md:mx-auto md:w-72 space-y-10 w-full">
                    <form onSubmit={onSubmit}>
                        <div>
                            <div class="mb-2 mt-8">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Nombre"
                                    value={name}
                                    onChange={onChange}
                                    className="border p-2 text-sm mb-0 w-full bg-white rounded-md py-1.5 text-c-Blue shadow-sm focus:ring-c-Orange focus:ring-1 focus:outline-none focus:shadow-inputLogin"
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
                                    className="border p-2 text-sm mb-0 w-full bg-white rounded-md py-1.5 text-c-Blue shadow-sm focus:ring-c-Orange focus:ring-1 focus:outline-none focus:shadow-inputLogin"
                                />
                            </div>
                            <div class="mt-2 mb-3">
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
                                <div className="text-xs font-medium  text-c-error mb-5">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-c-Orange hover:bg-c-Orange2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-c-Orange"
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>

                {successMessage && (
                    <div className="text-xs font-medium text-c-success mt-5">
                        {successMessage}
                    </div>
                )}       
                
                <div className="text-center">
                    <p className="mt-2 text-sm text-c-Blue">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/" className="font-medium text-c-Orange hover:text-c-Orange2 hover:underline">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;