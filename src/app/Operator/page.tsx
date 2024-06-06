'use client'
import React,{useState,useEffect} from 'react'
import Avatar from '@/components/atoms/Avatar/Avatar'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import OperatorEventCard  from '@/components/atoms/OperatorEventCard/OperatorEventCard'

function MisEVentos() {
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter()

    const logout = async (event: React.MouseEvent) => {
        const response = await axios.post('/api/auth/logout')
        router.push('/')
    }

    // Traer datos del operador
    const [user, setuser] = useState({
        email_address: "",
        password: "",
        id: "",
      });
    
      const getProfile = async () => {
        try {
            const response = await axios.get('/api/auth/PROFILE');
            setuser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setIsLoadingUser(false);
        }
      }
    
      React.useEffect(() => {
        getProfile()
      }, [])
    
    // Traer datos del los eventos al que pertenece
    const [eventos, setEventos] = useState([])
    const getEventos = async (email_address:string) => {
        const response = await axios.post('/api/operator/getOperatorEvents', {operator_email : email_address})
        setEventos(response.data)
    }

    useEffect(() => {
        if (!isLoadingUser && user.email_address) {
            getEventos(user.email_address);
        }
    }, [isLoadingUser, user.email_address]);

    return (
        <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
            <header className='w-full flex justify-end '>
                <button onClick={logout}><span className="material-symbols-outlined">
                    logout
                </span></button>
            </header>
            <div className='flex flex-col justify-center items-center'>
                <Avatar width={100} avatarOption='Black.png' />
                <h1 className='font-bold text-xl'>Operador </h1>
                <p>Welcome Back </p>
                <p>{user.email_address}</p>
            </div>
            <div>
                <h2 className='font-bold text-3xl'>Estos son tus eventos:</h2>
                <p>Selecciona uno para poder empezar a registrar usuarios.</p>
            </div>
            {/* Aqui se deberian de mostrar los eventos del operador */}
            <section className='flex flex-col gap-1 '>
                {eventos.map((evento:any) => {
                    return <OperatorEventCard 
                    key={evento.title}
                    id = {evento.id} 
                    title = {evento.title}
                    description = {evento.description}
                    location = {evento.location}
                    start = {evento.start}
                    end = {evento.end}
                    startTime = {evento.startTime}
                    endTime = {evento.endTime}
                    image_url= {evento.image_url}
                    />
                })}
            </section>
        </div>
    )
}

export default MisEVentos
