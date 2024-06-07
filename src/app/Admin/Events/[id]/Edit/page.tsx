'use client'
import React, { useState, useEffect, MouseEventHandler } from 'react'
import axios from 'axios'
import { Event } from "@/types"
import BackButton from "@/components/atoms/BackButton/BackButton"
import Image from "next/image"
import OperatorCardData from '@/components/atoms/OperatorCardData/OperatorCardData'
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'

async function loadEvents(eventID: number) {
    // traemos los datos del evento segun su id
    const { data } = await axios.get(`/api/events/${eventID}`)
    console.log(data)
    return data
}
function EditEvent({ params }: { params: any }) {
    const router = useRouter()
    interface Operator {
        email_address: string;
        password: string;
        id: string;
    }


    const [evento, setEvento] = useState<Event | null>(null);
    const [operator, setoperator] = useState<Operator[]>([]);
    const [operadoresEliminados, setOperadoresEliminados] = useState<Operator[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            console.log(params.id)
            const data = await loadEvents(params.id);
            setEvento(data);
            console.log(data)
        };

        fetchData();
    }, [params.id]);

    const getOperators = async (event_id: number) => {
        try {
            const response = await axios.post(`/api/admin/getOperatorsPerEvents`, { eventId: event_id });
            if (response.status === 201) {
                toast.warn('Este evento no tiene operadores asignados');
                setoperator([]);
            } else {
                setoperator(response.data);
            }
        } catch (error) {
            console.error('Error fetching operators:', error);
            setoperator([]);
        }
    }

    // esta función elimina un operador del arreglo de operadores pero no de la base de datos
    const handleRemoveOperator = (index: number) => {
        if (operator.length === 1) return toast.error('Tienes que tener al menos un operador')
                    // Guarda el operador que se eliminará en una variable temporal
        const operadorEliminado = operator[index];

        // Actualiza el arreglo de operadores eliminados
        setOperadoresEliminados(prevOperadoresEliminados => [...prevOperadoresEliminados, operadorEliminado]);
        setoperator(prevOperators => prevOperators.filter((_, i) => i !== index));
    }

    // Esta funcíon envia los cambios de los operadores a la base de datos
    const DeleteOperator = async (operador_id:string)=> {
        try {
            const result = await axios.delete('/api/admin/deleteOperator', {data:{operator_id:operador_id}} );
            if (result.status === 200) {
                toast.success('Operadores eliminados correctamente');
            }
        } catch (error) {
            toast.error('Error al eliminar operadores');
        }
    }

    // Función encargada de actualizar el evento
    const updateEvent = async () => {
        try {
            console.log(evento)
            const response = await axios.put('/api/events/update', evento);
            if (response.status === 200) {
                toast.success('Evento actualizado');
            }
        } catch (error) {
            toast.error('Error al actualizar el evento');
        }
    }

    // Esta función enviará los cambios a la base de datos
    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (evento) {
            try {
                if(operadoresEliminados.length === 0){
                    updateEvent();
                    return;
                }
                else{
                    const deleteRequests = operadoresEliminados.map(operador => DeleteOperator(operador.id));
                    await Promise.all(deleteRequests);
                    updateEvent();
                }
            } catch (error) {
                toast.error('Error al eliminar operadores');
            }
        }
    }

    useEffect(() => {
        if (evento) {
            getOperators(evento.id);
        }

    }, [operator]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (evento) {
            setEvento({
                ...evento,
                [event.target.name]: event.target.value
            })
        }
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (evento) {
            setEvento({
                ...evento,
                description: event.target.value
            })
        }
    }




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

    const inputStyle = 'w-full bg-customGray h-12 rounded-md p-2'
    const labelStyle = 'font-bold'


    return (
        <div className='w-full mb-5'>
            <div className="w-full h-72 bg-cover bg-center rounded-lg mb-5" style={{ backgroundImage: `url(${evento.image_url})` }}>
                {/* Contenido de image */}
            </div>
            <div className='flex gap-6 items-center mb-5'>
                <BackButton />
                <h1 className='font-bold text-5xl'>{evento.title}</h1>
            </div>


            <div className='flex justify-between px-5 gap-20'>
                {/* Contenedor Datos el evento */}
                <div className='flex flex-col gap-2 w-1/2'>
                    <h2 className="flex items-center font-bold text-3xl">
                        info
                        <span className="material-symbols-outlined font-bold">
                            info
                        </span>
                    </h2>

                    <div className='flex flex-col'>
                        <label className={labelStyle} htmlFor="title">Título del evento:</label>
                        <input className={inputStyle} type="text" defaultValue={evento.title} name='title' id='title' onChange={handleChange} />
                    </div>
                    {/* Fecha y hora inico de evento container */}
                    <div className='flex w-full gap-2'>
                        <div className='w-full'>
                            <div className='flex flex-col '>
                                <label className={labelStyle} htmlFor="start">Fecha de inicio:</label>
                                <input className={inputStyle} type="date" defaultValue={new Date(evento.start).toISOString().split('T')[0]} name='start' id='start' onChange={handleChange} />
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className='flex flex-col'>
                                <label className={labelStyle} htmlFor="startTime">Hora de inicio:</label>
                                <input className={inputStyle} type="time" defaultValue={evento.startTime} name='startTime' id='startTime' onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    {/* Fecha y hora fin container */}
                    <div className='flex gap-2'>
                        <div className='w-full' >
                            <div className='flex flex-col'>
                                <label className={labelStyle} htmlFor="end">Fecha de fin:</label>
                                <input className={inputStyle} type="date" defaultValue={new Date(evento.end).toISOString().split('T')[0]} name='end' id='end' onChange={handleChange} />
                            </div>
                        </div>
                        <div className='w-full' >
                            <div className='flex flex-col'>
                                <label className={labelStyle} htmlFor="endTime">Hora de fin:</label>
                                <input className={inputStyle} type="time" defaultValue={evento.endTime} name='endTime' id='endTime' onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    {/* Ubicacion container */}
                    <div className='flex flex-col'>
                        <label className={labelStyle} htmlFor="location">Ubicación:</label>
                        <input className={inputStyle} type="text" defaultValue={evento.location} name='location' id='location' onChange={handleChange} />
                    </div>
                    {/* Descripcion container */}
                    <div className='flex flex-col'>
                        <label className={labelStyle} htmlFor="description">Descripción:</label>
                        <textarea className={inputStyle} defaultValue={evento.description} name='description' id='description' onChange={handleDescriptionChange}></textarea>
                    </div>
                </div>
                {/* Contenedor de usuarios,boton y operadores */}
                <div className='flex flex-col justify-center w-1/2'>
                    <div>
                        {/* user data creator  */}
                    </div>
                    {/* operators container */}
                    <div className='bg-customGray rounded-lg w-full p-5'>
                        <h4 className='font-bold text-3xl mb-4'>Operadores: </h4>
                        <div>
                            {operator.length === 0 ? (
                                <p>No operators found.</p>
                            ) : (
                                operator.map((operator, index) => (
                                    <OperatorCardData
                                        key={operator.id}
                                        email={operator.email_address}
                                        password={operator.password}
                                        onRemove={() => handleRemoveOperator(index)}
                                    />
                                ))
                            )}
                        </div>
                        {/* <OperatorCardData /> */}
                    </div>
                    <div className='flex flex-col justify-center mt-5 gap-5'>
                        <button className="py-4 px-16 rounded-lg bg-customGreen hover:bg-lime-700 font-bold text-black " onClick={handleSubmit}>Guardar Cambios</button>
                        <p className='flex items-center'><span className="material-symbols-outlined text-yellow-400">
                            notification_important
                        </span>Para deshacer los cambios solo recarga la pagina</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditEvent
