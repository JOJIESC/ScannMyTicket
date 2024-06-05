'use client'
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useRouter } from 'next/navigation'

function LoginOperator() {
  const router = useRouter()

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

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault()
    console.log(credentials)
    const results = await axios.post('http://localhost:3000/api/auth/operators/login', credentials)
    console.log(results)
    if (results.status === 200){
      toast.success('Bienvenido')
      router.push('/Operator')
    }else{
      toast.error('Error al iniciar sesion')
    }
  }



  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="flex justify-center flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
    <svg height="48px" viewBox="0 -960 960 960" width="48px"
                    fill="#8C1AF6">
                    <path d="M349-120H180q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h169v60H180v600h169v60Zm103 80v-880h60v880h-60Zm163-80v-60h60v60h-60Zm0-660v-60h60v60h-60Zm165 660v-60h60q0 25-17.62 42.5Q804.75-120 780-120Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60q24.75 0 42.38 17.62Q840-804.75 840-780h-60Z" /></svg>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Ingresa con tu cuenta de operador
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Correo electronico
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <button
          onClick={handleSubmit}
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
          <a className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base text-center font-bold rounded-lg text-indigo-500 hover:text-customGreen focus:ring-4 focus:ring-primary-300" href="/">Regresar</a>
        </div>
      </form>
    </div>
  </div>
  )
}

export default LoginOperator
