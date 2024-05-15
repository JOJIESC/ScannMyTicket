import React from 'react'
import Image from 'next/image'

function Login() {
  return (
<div className="flex flex-col md:flex-row h-screen w-auto bg-white"> 
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8"> 
                <div className="w-full max-w-xs flex flex-col ml-10 gap-3">
                    <h1 className="text-5xl font-bold text-black mb-8">Inicia Sesión</h1>
                </div>
                <form className="w-full max-w-lg flex flex-col ml-10 gap-3">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-black">Correo Electrónico</label>
                        <input type="email" id="email" className="border bg-customGray border-gray-300 rounded-md p-2 " required/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-black">Contraseña</label>
                        <input type="password" id="password" className="border  bg-customGray border-gray-300 rounded-md p-2 " required />
                    </div>
                    <button type="submit" className="bg-customGreen text-black hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded">
                        Iniciar Sesión
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-black">
                    ¿No tienes una cuenta? <a href="/signup" className="font-bold hover:text-customGreen">Registrate</a>
                </p>
            </div>
            <div className="w-full md:w-1/2 flex"> 
                <Image src="/img/login.png" alt="login" className="m-auto h-auto w-auto" width={600} height={600}/> 
            </div>
        </div>

  )
}

export default Login
