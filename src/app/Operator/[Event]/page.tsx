'use client'
import React,{useState,useEffect} from 'react'
import Avatar from '@/components/atoms/Avatar/Avatar'
import Link from 'next/link'
import axios from 'axios'
import { useRouter,useParams } from 'next/navigation'
import BackButton from '@/components/atoms/BackButton/BackButton'

function DashboardOperator() {
    const router = useRouter()
    const params  = useParams()
    console.log(params)
    const event_id = params.Event
    console.log(event_id)
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [evento, setEvento] = useState({
        title: "",
        start: "",
        end: "",
        startTime: "",
        endTime: "",
        description: "",
        location: "",
      });

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
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setIsLoadingUser(false);
        }
      }
    
      React.useEffect(() => {
        getProfile()
      }, [])

      // Traer datos del evento al que pertenece

        const getEvent = async () => {
            try {
                console.log()
                console.log(event_id)
                const response = await axios.get(`/api/events/${event_id}`);
                setEvento(response.data);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        }

        useEffect(() => {
            if (params) {
                console.log()
                getEvent();
            }
        }, [!isLoadingUser && event_id])
    
    return (
        <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
            <header className='w-full flex justify-between '>
                <BackButton />
                <button onClick={logout}><span className="material-symbols-outlined">
                    logout
                </span></button>
            </header>
            <div className='flex flex-col justify-center items-center'>
                <Avatar width={100} avatarOption='Black.png'/>
                <h1>Operador</h1>
                <p>Welcome Back </p>
            </div>

            <h2 className='font-bold text-xl'>Datos sobre tu evento:</h2>
            <div className='flex flex-col  bg-customGray rounded-lg p-7'>
                <div>
                    <h3 className='font-bold'>Titulo: {evento.title}</h3>
                    <p>Fecha de inicio: {evento.start}</p>
                    <p>Hora de inicio: {evento.startTime}</p>
                    <p>Fecha de fin: {evento.end}</p>
                    <p>Hora de conclusión: {evento.endTime}</p>
                    <p>Ubicación: {evento.location}</p>
                </div>
            </div>
                <div className='flex flex-col gap-2 text-white'>
                <Link href='/Operator/Scanner' className='bg-[url("/img/operator/escaneaCodigos.png")] bg-cover h-40 w-full bg-center rounded-lg relative'>
                    <p className='font-bold absolute text-2xl left-3 top-3 w-24'>Escanea codigos</p>
                </Link>
                <Link href='#' className='bg-[url("/img/operator/checkScanns.png")] bg-cover h-40 w-full bg-center rounded-lg relative'>
                    <p className='font-bold absolute text-2xl left-3 top-3 w-24'>
                        Ultimos elementos escaneados
                    </p>
                </Link>
                </div>

        </div>
    )
}

export default DashboardOperator
