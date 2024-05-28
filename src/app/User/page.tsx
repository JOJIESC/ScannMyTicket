'use client'

import React from 'react';
import Avatar from '@/components/atoms/Avatar/Avatar';
import axios from 'axios';
import { useState } from 'react';
import {toast} from "react-toastify"

const Dashboard = () => {

    const [user, setuser] = useState({
        id: "",
        email: "",
        username: "",
        role: ""
    })

    const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE')
        setuser(response.data)
        console.log(response)
    }


    //esta funcion toma los datos del usuario y setea el usuario
    React.useEffect(() => {
        getProfile()
    }, [])

    const changeProfileToOrganizer = async () => {
        const userData = {
            id: user.id,
            role: user.role
        }
        const response = await axios.put('/api/users/setOrganizerRole', userData)
        console.log(userData)
        toast.success(response.data)
        if (response.status === 200) {
            toast.success('Perfil actualizado')
        // Obtén un nuevo token después de actualizar el perfil
        const id = userData.id
        console.log(id)
        const authResponse = await axios.post('/api/users/refreshToken', id)
        if (authResponse.status === 200) {
            // Guarda el nuevo token en las cookies
            toast.success('Token actualizado')
        }
        }
    }

    return (
        <main className='py-11 px-36 flex gap-7 flex-col'>
            <div className='flex items-center gap-10 mb-5'>
                <Avatar width={150} />
                <div>
                    <h1 className='font-bold text-7xl'>Home</h1>
                    <p>Bienvenido {user.username}</p>
                </div>
            </div>
            <div className='flex gap-7'>
                <a className=' w-full h-72 rounded-lg text-white relative' href="/User/Events">
                    <div className='bg-[url("/img/dashboardUser/sectionEventos.jpg")] bg-cover w-full h-full relative blur-[1px] rounded-lg'>
                    </div>
                    <p className='absolute bottom-5 right-6 font-bold text-4xl flex gap-3 items-center'>
                        <span className="material-symbols-outlined">
                            event_list
                        </span>
                        Eventos</p>
                </a>
                <a className='w-full h-72 rounded-lg text-white relative' href="/User/MisTickets">
                    <div className='bg-[url("/img/dashboardUser/TusTickets.png")] bg-cover w-full h-full relative blur-[1px] rounded-lg'>
                    </div>
                    <p className='absolute bottom-5 right-6 font-bold text-4xl flex gap-3 items-center'>
                        <span className="material-symbols-outlined">
                            confirmation_number
                        </span>
                        Tus Tickets</p>
                </a>
            </div>
            <div className='flex'>
                <a onClick={changeProfileToOrganizer} className=' w-full h-36 rounded-lg text-white relative' href="/Organizer">
                    <div className='bg-[url("/img/dashboardUser/SectionNewEvent.jpg")] bg-cover w-full h-full relative blur-[1px] rounded-lg'>
                    </div>
                    <p className='absolute bottom-5 right-6 font-bold text-4xl flex gap-3 items-center'>
                        <span className="material-symbols-outlined">
                            add_circle
                        </span>
                        Crear evento</p>
                </a>
            </div>
        </main>
    );
};

export default Dashboard;