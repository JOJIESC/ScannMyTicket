'use client';

import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Asegúrate que sea de 'next/navigation'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

// Nombre del componente debe empezar con Mayúscula
export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        email: "", // Coincide con el backend
        password: ""
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Llama a tu API de login
            const response = await axios.post('/api/auth/login', credentials);

            if (response.status === 200 && response.data.user) {
                toast.success('¡Bienvenido!');
                // Forzamos un refresco a una ruta protegida genérica,
                // el middleware se encargará de redirigir al dashboard correcto.
                window.location.href = '/User'; // O '/Admin' si prefieres, el middleware corregirá
            } else {
                 // Si la API responde 200 pero sin datos de usuario, algo falló
                 toast.warn('Respuesta inesperada del servidor.');
            }
        } catch (error: any) {
            console.error("Error en login:", error);
            // Muestra el mensaje de error de la API si existe, o uno genérico
            const message = error.response?.data?.message || 'Usuario o contraseña incorrectos';
            toast.warn(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-white">
            {/* Columna del Formulario */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 lg:p-16">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center md:text-left">Inicia Sesión</h1>
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                name='email'
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={handleChange}
                                required
                                placeholder="tu@correo.com"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                name='password'
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={handleChange}
                                required
                                placeholder="********"
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type='submit'
                            className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Regístrate
                        </Link>
                    </p>
                    <hr className="my-6 border-gray-300" />
                    <div className="text-center">
                         <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                             ← Volver al inicio
                         </Link>
                    </div>
                </div>
            </div>
            {/* Columna de la Imagen */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center p-8">
                {/* Puedes usar una imagen directamente desde /public o un componente Image de Next.js si la configuras */}
                 <img
                     src="/img/login.png" // Asegúrate que esta ruta sea correcta dentro de /public
                     alt="Ilustración de Login"
                     className="max-w-md lg:max-w-lg object-contain"
                     // width={600} // Opcional si usas img normal
                     // height={600} // Opcional si usas img normal
                 />
            </div>
        </div>
    );
}

// export default login // Incorrecto
// export default LoginPage // Correcto si renombras la función
