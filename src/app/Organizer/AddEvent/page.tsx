import React from 'react'

function AddEvent() {
    return (
        <div className='w-full h-full'>

            {/* IMG container */}
            <div className="flex items-center justify-center w-full mb-5">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-customGray hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                </label>
            </div>

            {/* Forms bottom section */}
            <section className='flex gap-4 mb-5'>
                {/* Event form container */}
                <div className='w-1/2'>
                    <div>
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First name</label>
                        <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder="John" required />
                    </div>
                    <div className='flex gap-2'> {/* Inicio inputs container */}
                        <div className='w-1/2'>
                            <label htmlFor="fechaInicio" className="block mb-2 text-sm font-medium text-gray-900">Fecha de inicio</label>
                            <input type="date" id='fechaInicio' name='start' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder="DD-MM-YYYY" required />
                        </div>
                        <div className='w-1/2'>
                            <label htmlFor="horaInicio" className="block mb-2 text-sm font-medium text-gray-900">Hora de inicio</label>
                            <input type="time" id='horaInicio' name='startTime' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray " placeholder="HH-MM" required />
                        </div>
                    </div>
                    <div className='flex gap-2'>{/* Conclusion fecha container */}
                        <div className='w-1/2'>
                            <label htmlFor="fechaFinal" className="block mb-2 text-sm font-medium text-gray-900">Fecha final</label>
                            <input type="date" id='fechaFinal' name='end' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder="DD-MM-YYYY" required />
                        </div>
                        <div className='w-1/2'>
                            <label htmlFor="horaFinal" className="block mb-2 text-sm font-medium text-gray-900">Hora final</label>
                            <input type="time" id='horaFinal' name='endTime' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder="HH-MM" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="location">Ubicación del evento:</label>
                        <input type="text" id="location" name='location' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder="Calle 123, Ciudad, País" required />
                    </div>

                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Descripción</label>
                    <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-customGray" placeholder="Describe tu evento aquí..."></textarea>

                </div>
                {/* Add operators container */}
                <div className='flex flex-col p-4 items-center w-1/2 bg-customGray rounded-lg'>
                    <h1 className='flex items-center justify-start w-full font-bold text-xl'>Añadir operadores
                        <span className="material-symbols-outlined ml-4">
                            add_circle
                        </span>
                    </h1>
                    <form action="" className='flex flex-col justify-around w-full h-full'>
                        <div>
                            <label htmlFor="emailOperator">Email del operador</label>
                            <input type="email" name='email_address' id='emailOperator' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder='email@email.com' />
                        </div>
                        <div>
                            <label htmlFor="password">Contraseña del operador</label>
                            <input type="password" name='password' id='password' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-customGray" placeholder='•••••••••'/>
                        </div>
                        <button className="font-bold py-2 px-10 rounded-lg bg-indigo-600 text-white hover:bg-indigo-900">Añadir operador a mi evento</button>
                    </form>
                </div>
            </section>
            {/* Footer button */}
            <footer className='flex justify-center w-full '>
                <button className="font-bold py-3 px-28 rounded-lg bg-customGreen hover:bg-lime-600">Agregar Evento</button>
            </footer>

        </div>
    )
}

export default AddEvent
