'use client'

import React from 'react';
import Avatar from '@/components/atoms/Avatar/Avatar';
import axios from 'axios';
import { useState } from 'react';

const Dashboard = () => {

    const [user, setuser] = useState({
        email: "",
        username: ""
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
                    <div className='bg-[url("/img/dashboardUser/sectionEventos.jpg")] bg-cover w-full h-full relative blur-sm'>
                    </div>
                    <p className='absolute bottom-5 right-6 font-bold text-4xl flex gap-3 items-center'>
                        <span className="material-symbols-outlined">
                            event_list
                        </span>
                        Eventos</p>
                </a>
                <a className='w-full h-72 rounded-lg text-white relative' href="/User/MisTickets">
                    <div className='bg-[url("/img/dashboardUser/TusTickets.png")] bg-cover w-full h-full relative blur-sm'>
                    </div>
                    <p className='absolute bottom-5 right-6 font-bold text-4xl flex gap-3 items-center'>
                        <span className="material-symbols-outlined">
                            confirmation_number
                        </span>
                        Tus Tickets</p>
                </a>
            </div>
            <div className='flex'>
                <a className=' w-full h-36 rounded-lg text-white relative' href="/User/TuEvento">
                    <div className='bg-[url("/img/dashboardUser/SectionNewEvent.jpg")] bg-cover w-full h-full relative blur-sm'>
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