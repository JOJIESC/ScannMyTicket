'use client'
import React, { useState } from 'react'
import AddOperatorModal from '@/components/molecules/Modal/Modal'
import OperatorCardData from '@/components/atoms/OperatorCardData/OperatorCardData'
import axios from 'axios'
import { toast } from 'react-toastify'

// este codigo solo lo entiende dios y yo

function FormAddEvent() {

    const [event, setEvent] = useState({
        title: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        description: "",
        image: "",
        location: ""
    })

    const [file, setFile] = useState<File | null>(null)


    const [user, setuser] = useState({
        id: ""
      });
    
      const getProfile = async () => {
        const response = await axios.get('/api/auth/PROFILE')
        setuser(response.data)
    }
    
    //esta funcion toma los datos del usuario y setea el usuario
    React.useEffect(() => {
      getProfile()
    }, [])
    
    const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
            
        })
    }

    interface Operator {
        email: string;
        password: string;
        event_id: number;
    }


    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [operators, setOperators] = useState<Operator[]>([]);


    const toggleModal = () => {
        setShowModal(!showModal)
    }



    const handleAddOperator = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const newOperator = { email, password, event_id: 0}; // Provide an initializer for the "event_id" property
        if (operators.find(operator => operator.email === email)) {
            alert('El operador ya existe, por favor ingresa otro operador con un correo diferente.');
            return;
        } else {
            setOperators(prevOperators => [...prevOperators, newOperator]);
        }
    }


    const handleRemoveOperator = (index: number) => {
        setOperators(prevOperators => prevOperators.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', event.title)
        formData.append('startDate', event.startDate)
        formData.append('startTime', event.startTime)
        formData.append('endDate', event.endDate)
        formData.append('endTime', event.endTime)
        formData.append('description', event.description)
        formData.append('user_id', user.id)
        formData.append('location', event.location)
        if (file !== null) {
            formData.append('image', file)

        }
        const result = await axios.post('http://localhost:3000/api/events', formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            
        });
        const event_id = result.data.event_id;
        const UpdatedOperators = operators.map(operator => {
            return {
                ...operator, 
                event_id: event_id}
        })
        
        const SubmitOperator = await axios.post('http://localhost:3000/api/events/postOperator', UpdatedOperators)

        if(result.status === 201){
            toast.success('Evento creado con exito')
        }else{
            toast.error('Ocurrio un error al crear el evento')
        }
        if(SubmitOperator.status === 200){
            toast.success('Operadores agregados con exito')
        }
        else{
            toast.error('Ocurrio un error al agregar los operadores')
        }
    }

    return (
        <div className='w-full p-3'>
            {showModal &&
                <AddOperatorModal show={showModal} onClose={toggleModal}>
                    <div className='flex flex-col gap-3'>
                        <h5 className='font-bold text-2xl'>Agrega un operador</h5>
                        <form onSubmit={handleAddOperator} className='flex flex-col gap-3'>
                            <div className='flex flex-col'>
                                <label htmlFor="email">Correo del operador</label>
                                <input type="email" id='email' name='email' onChange={(event) => { setEmail(event.target.value) }}
                                    className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="password">Contraseña del operador</label>
                                <input type="password" id='password' name='password' onChange={(event) => { setPassword(event.target.value) }}
                                    className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                            </div>
                            <button className=' w-full font-bold text-lg bg-customGreen rounded-sm px-6 py-1 text-white' type='submit'>Agregar operador</button>
                        </form>

                        {operators.length > 0 &&
                            <button
                            onClick={()=>toggleModal()}
                                className="w-full group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                            >
                                <span className="absolute -end-full transition-all group-hover:end-4">
                                    <svg
                                        className="size-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </span>

                                <span className="text-sm font-medium transition-all group-hover:me-4"> Siguiente </span>
                            </button>}

                        {operators.map((operator, index) => {
                            return <OperatorCardData key={index} email={operator.email} password={operator.password} onRemove={() => { handleRemoveOperator(index) }} />
                        })}


                    </div>
                </AddOperatorModal>}
            <section className='flex flex-col gap-3'>
                <h3 className='font-bold text-5xl'>!Crea tu evento!</h3>
                <p className='w-1/2'>Aquí podrás crear tu evento facilmente, solo llena los campos solicitados y
                    después da click en el boton continuar para que puedas agregar a tus operadores.
                </p>
            </section>
            <section className='p-5'>
                <form className=' flex gap-3 flex-col border rounded-md p-3 ' onSubmit={handleSubmit}>
                    {/* contenedor imagen del evento */}
                    <div className='flex justify-between items-center'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Portada de tu evento</h4>

                            <div className="flex items-center justify-start w-full">
                                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-14 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                    <div className="flex gap-4 items-center justify-center pt-5 pb-6">
                                        <svg className="w-5 h-5 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                        </svg>
                                        <p>Da click para seleccionar una imagen</p>
                                    </div>
                                    <input name='image' onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setFile(e.target.files[0])
                                        }

                                    }} id="image" type="file" className="hidden" />
                                </label>
                            </div>
                        </div>
                        {/* aquí va la imagen cargada 👇 */}
                        <div className=' flex justify-center w-2/5  rounded-lg'>
                            {file && <img src={URL.createObjectURL(file)} alt="imagen" className='w-auto h-auto max-h-52 object-cover rounded-lg' />}
                        </div>
                    </div>
                    <hr />
                    {/* Contenedor del título */}
                    <div className='flex justify-between'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Titulo de tu evento</h4>
                        </div>
                        <div className='w-2/5'>
                            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Título del evento</label>
                            <input name='title' onChange={handleChangeEvent} placeholder='Evento' id='title' className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required type="text" />
                        </div>
                    </div>
                    <hr />
                    {/* contenedor del inicio del evento */}
                    <div className='flex justify-between items-center'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Inicio del evento</h4>
                        </div>
                        <div className='flex w-2/5 gap-2'>
                            <div className='w-1/2'>
                                <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900">Fecha de inicio</label>
                                <input name='startDate' onChange={handleChangeEvent} className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="date" id='startDate' required />
                            </div>
                            <div className='w-1/2'>
                                <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-gray-900">Hora de inico</label>
                                <input name='startTime' onChange={handleChangeEvent} className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="time" id='startTime' required />
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* contenedor fin del evento */}
                    <div className='flex justify-between items-center'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Final del evento</h4>
                        </div>
                        <div className='flex w-2/5 gap-2'>
                            <div className='w-1/2'>
                                <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900">Fecha de conclusión</label>
                                <input name='endDate' onChange={handleChangeEvent} className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="date" id='endDate' required />
                            </div>
                            <div className='w-1/2'>
                                <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-gray-900">Hora de conclusión</label>
                                <input name='endTime' onChange={handleChangeEvent} className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" type="time" id='endTime' required />
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* contenedor de ubicación del evento */}
                    <div className='flex justify-between'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Ubicación de tu evento</h4>
                        </div>
                        <div className='w-2/5'>
                            <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">Ubicación del evento</label>
                            <input onChange={handleChangeEvent} name='location' placeholder='Calle # 123 C.P # 4321' id='location' className="bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required type="text" />
                        </div>
                    </div>
                    <hr />
                    {/* contenedor descripcion del evento */}
                    <div className='flex justify-between items-center'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Descripción</h4>
                        </div>
                        <div className='w-2/5'>
                            <div className='flex flex-col '>
                                <label htmlFor="description">Descripción</label>
                                <textarea onChange={handleChangeEvent} className='block p-2.5 w-full text-sm h-28 text-gray-900 bg-gray-50 rounded-lg  focus:ring-blue-500 focus:border-blue-500"' name="description" id="description" placeholder='Tu descripción...' required></textarea>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {/* contenedor de operadores */}
                    <div className='flex justify-between items-center'>
                        <div className='w-1/2'>
                            <h4 className='font-bold text-base'>Operadores</h4>
                            <button
                            type='button'
                        onClick={toggleModal}

                        className="w-60 group relative inline-flex items-center overflow-hidden rounded bg-indigo-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                    >
                        <span className="absolute -end-full transition-all group-hover:end-4">
                            <svg
                                className="size-5 rtl:rotate-180"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </span>

                        <span className="text-sm font-medium transition-all group-hover:me-4"> Agrega operadores </span>
                        
                    </button>
                        </div>
                        <div className='flex flex-col gap-1 w-2/5'>
                        {operators.map((operator, index) => {
                            return <OperatorCardData key={index} email={operator.email} password={operator.password} onRemove={() => { handleRemoveOperator(index) }} />
                        })}

                        </div>
                    </div>
                    <hr />

                    {operators.length > 0 &&
                            <button
                            type='submit'
                                className="w-full group relative inline-flex items-center overflow-hidden rounded bg-customGreen font-bold px-8 py-3 text-white focus:outline-none focus:ring active:bg-indigo-500"
                            >
                                <span className="absolute -end-full transition-all group-hover:end-4">
                                    <svg
                                        className="size-5 rtl:rotate-180"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </span>

                                <span className="text-sm font-medium transition-all group-hover:me-4"> Crear Evento </span>
                            </button>}
                </form>
            </section>
        </div>
    )
}

export default FormAddEvent
