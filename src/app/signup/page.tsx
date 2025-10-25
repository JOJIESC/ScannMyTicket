'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';
// Asumiendo que tienes un componente Avatar similar al del proyecto anterior
// import Avatar from "@/components/atoms/Avatar/Avatar"; 

// Nombre del componente con Mayúscula inicial
export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [adduser, setAddUser] = useState({
        email_address: "",
        first_name: "",
        last_name: "",
        password: "",
        phone_number: "", // Opcional según tu lógica
        birth_date: "",
        avatar: "", // Opcional según tu lógica
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddUser({
            ...adduser,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // 1. Registra al nuevo usuario
            const registerRes = await axios.post(`/api/auth/register`, adduser); // Usa la nueva ruta

            if (registerRes.status === 201) { // Verifica el status 201 Created
                toast.success('Usuario creado, iniciando sesión...');

                // 2. Inicia sesión automáticamente con las credenciales
                const loginRes = await axios.post('/api/auth/login', {
                    email: adduser.email_address, // Coincide con el backend de login
                    password: adduser.password
                });

                // 3. Si el login es exitoso, redirige via middleware
                if (loginRes.status === 200) {
                    window.location.href = '/User'; // Deja que el middleware decida
                } else {
                     toast.error('Error al iniciar sesión después del registro.');
                }
            }
            // No necesitas resetear el form si vas a redirigir
            // if (form.current) {
            //   (form.current as HTMLFormElement).reset()
            // }
        } catch (error: any) {
            console.error("Error en signup:", error);
            const message = error.response?.data?.message || 'Ocurrió un error durante el registro.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    const form = useRef<HTMLFormElement>(null);

    // Lista de avatares (si la usas)
    // const Avatares = [ ... ];

    return (
         <main className="flex flex-col md:flex-row min-h-screen w-full bg-white">
             {/* Columna del Formulario */}
             <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 lg:p-16 order-2 md:order-1">
                 <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center md:text-left">Crea tu Cuenta</h1>
                     <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                             <div className="w-full sm:w-1/2">
                                 <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">Nombre</label>
                                 <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" placeholder="Tu nombre" name="first_name" onChange={handleChange} required disabled={isLoading} />
                             </div>
                             <div className="w-full sm:w-1/2">
                                 <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">Apellido</label>
                                 <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="text" placeholder="Tu apellido" name="last_name" onChange={handleChange} required disabled={isLoading} />
                             </div>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email_address">Correo</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="email" placeholder="tu@correo.com" name="email_address" onChange={handleChange} required disabled={isLoading} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Contraseña</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" placeholder="********" name="password" onChange={handleChange} required disabled={isLoading} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">Número de teléfono (Opcional)</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="tel" placeholder="555-123-4567" name="phone_number" onChange={handleChange} disabled={isLoading} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birth_date">Fecha de nacimiento</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="date" name="birth_date" onChange={handleChange} required disabled={isLoading} />
                         </div>

                         {/* Selección de Avatar (Opcional, si lo implementas) */}
                         {/* <div className="flex items-center gap-5 w-full"> ... </div> */}

                         <button type="submit" className="w-full mt-6 px-4 py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                             {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                         </button>
                     </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                         ¿Ya tienes una cuenta?{' '}
                         <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                             Inicia sesión
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
              <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-400 to-blue-500 items-center justify-center p-8 order-1 md:order-2">
                  <img
                      src="/img/registro.png" // Asegúrate que la ruta sea correcta
                      alt="Ilustración de Registro"
                      className="max-w-md lg:max-w-lg object-contain"
                  />
              </div>
         </main>
    );
}

// export default signup // Incorrecto
// export default SignupPage // Correcto
