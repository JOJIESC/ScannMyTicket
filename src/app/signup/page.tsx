// Ruta: src/app/signup/page.tsx
'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';
import Avatar from "@/components/atoms/Avatar/Avatar"; // Asegúrate que la ruta sea correcta

// CORRECCIÓN: Nombre de componente con Mayúscula
export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [adduser, setAddUser] = useState({
        email_address: "",
        first_name: "",
        last_name: "",
        password: "",
        phone_number: "", // Opcional
        birth_date: "",
        avatar: "Black.png", // Asignar un avatar por defecto
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddUser({
            ...adduser,
            [event.target.name]: event.target.value
        });
    }

    // CORRECCIÓN: Quitado handleSelect, se usa handleChange directo en el select
    // const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => { ... }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (adduser.password.length < 6) { // Validación simple
             toast.warn("La contraseña debe tener al menos 6 caracteres");
             setIsLoading(false);
             return;
        }

        try {
            // *** CORRECCIÓN: Apunta a la ruta de API correcta para crear usuario ***
            const registerRes = await axios.post(`/api/users/new`, adduser);

            if (registerRes.status === 201) { // 201 Created (como lo definimos en la API de /users/new)
                toast.success('Usuario creado, iniciando sesión...');

                // 2. Inicia sesión automáticamente
                const loginRes = await axios.post('/api/auth/login', {
                    email: adduser.email_address, // La API de login espera 'email'
                    password: adduser.password
                });

                // 3. Si el login es exitoso, redirige via middleware
                if (loginRes.status === 200) {
                    window.location.href = '/User'; // Deja que el middleware decida la ruta final
                } else {
                     toast.error('Error al iniciar sesión después del registro.');
                }
            }
        } catch (error: any) {
            console.error("Error en signup:", error);
            const message = error.response?.data?.message || 'Ocurrió un error durante el registro.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    const form = useRef<HTMLFormElement>(null);

    // Lista de avatares
    const Avatares = [
        "Black.png", "Dark.jpg", "DeepPurple.jpg", "Gas.png", "Japan.png",
        "ManaPurple.jpg", "OceanBlue.jpg", "Purple.png", "Red.jpg",
        "RiverBlue.jpg", "Temple.png", "Ventura.jpg", "Warm.png"
    ];

    return (
         <main className="flex flex-col md:flex-row min-h-screen w-full bg-white">
             {/* Columna del Formulario */}
             <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 lg:p-12 order-2 md:order-1">
                 <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center md:text-left">Crea tu Cuenta</h1>
                     <form ref={form} onSubmit={handleSubmit} className="space-y-4">
                         {/* --- Campos del formulario --- */}
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
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="password" placeholder="Mínimo 6 caracteres" name="password" onChange={handleChange} required disabled={isLoading} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone_number">Número de teléfono (Opcional)</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="tel" placeholder="555-123-4567" name="phone_number" onChange={handleChange} disabled={isLoading} />
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="birth_date">Fecha de nacimiento</label>
                             <input className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="date" name="birth_date" onChange={handleChange} required disabled={isLoading} />
                         </div>

                         {/* Selección de Avatar */}
                         <div className="w-full">
                           <label htmlFor="avatar" className="block text-sm font-medium text-gray-900 mb-1">Selecciona un avatar: </label>
                           {/* CORRECCIÓN: Usar handleChange aquí también */}
                           <select onChange={handleChange} name="avatar" id="avatar" className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " value={adduser.avatar} required>
                             {Avatares.map((avatarName, index) => {
                               return <option key={index} value={avatarName}>{avatarName.split('.')[0]}</option> // Muestra nombre sin extensión
                             })}
                           </select>
                         </div>
                         {/* <Avatar width={100} avatarOption={adduser.avatar} /> // Puedes mostrar el avatar seleccionado */}

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
                      src="/img/registro.png" // Ruta a tu imagen de registro
                      alt="Ilustración de Registro"
                      className="max-w-md lg:max-w-lg object-contain"
                  />
              </div>
         </main>
    );
}