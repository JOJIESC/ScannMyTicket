'use client'

import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

function login() {

    const router = useRouter();

    const [credentials, setcredentials] = useState({
        email: "",
        password: ""
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setcredentials({
            ...credentials,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        console.log(credentials);

        try {
            const response = await axios.post('/api/auth/login', credentials);

            console.log(response);
            //si el status es 200 redirigir a su ruta permitida
            if (response.status === 200) {
                const { role } = response.data;
                console.log(role);
                switch (role) {
                    case 'admin':
                        router.push('/Admin');
                        break;
                    case 'operator':
                        router.push('/Operator');
                        break;
                    case 'user':
                        router.push('/User');
                        break;
                    case 'organizer':
                       router.push('/Organizer');
                        break;
                    default:
                        router.push('/login');
                        break;
                }
            }
        } catch (error) {
            console.log(error);
            toast.warn('Usuario o contraseña incorrectos');
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-auto bg-white">
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
                <div className="w-full max-w-xs flex flex-col gap-3">
                    <h1 className="text-5xl font-bold text-black mb-8">Inicia Sesión</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-3">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-black">Correo Electrónico</label>
                        <input name='email' type="email" id="email" className="border bg-customGray border-gray-300 rounded-md p-2 " onChange={handleChange} required />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-black">Contraseña</label>
                        <input name='password' type="password" id="password" className="border  bg-customGray border-gray-300 rounded-md p-2 " onChange={handleChange} required />
                    </div>
                    <button type='submit' className="bg-customGreen text-black hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded">
                        Iniciar Sesión
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-black">
                    ¿No tienes una cuenta? <a href="/signup" className="font-bold hover:text-customGreen">Registrate</a>
                </p>
            </div>
            <div className="w-full md:w-1/2 flex">
                <Image src="/img/login.png" alt="login" className="m-auto h-auto w-auto max-md:hidden" width={600} height={600} />
            </div>
        </div>

    )
}

export default login
