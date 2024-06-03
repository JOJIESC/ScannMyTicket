'use client'
import axios from "axios"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Event } from "@/types"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import BackButton from "@/components/atoms/BackButton/BackButton"

async function loadEvents(eventID: number) {
    // traemos los datos del evento segun su id
    const { data } = await axios.get(`http://localhost:3000/api/events/${eventID}`)
    return data
}

const getProfile = async () => {
    const response = await axios.get('/api/auth/PROFILE')
    console.log(response)
    return response
}




function EventPage({ params }: { params: any },response:any) {

    const [evento, setEvento] = useState<Event | null>(null);
    const [userID, setUserID] = useState(null);

//esta funcion toma los datos del usuario y setea el usuario
React.useEffect(() => {
    getProfile()
    .then((response) => {
        setUserID(response.data.id)
    })
    .catch((error) => {
        console.log(error)
    })
  }, [])
  

    useEffect(() => {
        const fetchData = async () => {
            console.log(params.id)
            const data = await loadEvents(params.id);
            setEvento(data);
        };

        fetchData();
    }, [params.id]);


    // si no hay evento, mostramos un spinner de carga
    if (!evento) {
        return (
            <div className="flex justify-center items-center h-dvh w-full">
                <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>)
    }

    // obtenemos los datos del evento segun su id

    console.log(evento)

    return (
        <div>
            
            <main className="flex justify-around w-full h-full py-28 px-20 gap-8 ">
                <div className="flex flex-col gap-8">
                <BackButton />
                    <Image className="h-80 w-auto rounded-lg" src={evento.image_url} alt={evento.title} width={500} height={200} />
                    <div>
                    <h3 className="font-bold text-2xl">Descripción: </h3>
                    <p>{evento.description}</p>
                    </div>

                    <div>
                    <h3 className="font-bold text-2xl">Ubicación: </h3>
                    <p>{evento.location}</p>
                    </div>
                    
                    
                </div>
                <div className="flex flex-col max-w-[340px] gap-8">
                    <div>

                        <h1 className="flex font-bold text-4xl">
                            Evento:
                        </h1>
                        <h1 className="flex font-bold text-4xl">
                            {evento.title}
                        </h1>
                    </div>
                    <section className="flex flex-col gap-5 text-2xl">
                        <h2 className="flex items-center font-bold">
                            info
                            <span className="material-symbols-outlined font-bold">
                                info
                            </span>
                        </h2>
                        <div>
                            <p className="font-bold">Fecha de inicio: </p>
                            <p>{evento.start.toString()}</p>
                            <div>
                                <p>Hora inicio: {evento.startTime}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-bold">Fecha de conclusión: </p>
                            <p >{evento.end.toString()}</p>
                            <div>
                                <p>Hora de conclusión: {evento.endTime}</p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    )
}

export default EventPage
