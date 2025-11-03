// Ruta: src/app/signup/page.tsx
'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';
// Importa Avatar si lo tienes en esa ruta:
// import Avatar from "@/components/atoms/Avatar/Avatar"; 

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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        if (adduser.password.length < 6) {
             toast.warn("La contraseña debe tener al menos 6 caracteres");
             setIsLoading(false);
             return;
        }

        try {
            // *** CORRECCIÓN CLAVE: Apunta a la ruta de API correcta para crear usuario ***
            const registerRes = await axios.post(`/api/users/new`, adduser);

            if (registerRes.status === 201) { // 201 Created
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

    // Lista de avatares (para el Select)
    const Avatares = [
        "Black.png", "Dark.jpg", "DeepPurple.jpg", "Gas.png", "Japan.png",
        "ManaPurple.jpg", "OceanBlue.jpg", "Purple.png", "Red.jpg",
        "RiverBlue.jpg", "Temple.png", "Ventura.jpg", "Warm.png"
    ];

    return (
         <main className="flex flex-col md:flex-row min-h-screen w-full bg-white">
             {/* ... (Todo el HTML del formulario y diseño va aquí) ... */}
         </main>
    );
}