'use client'

import React from 'react'
import Avatar from '@/components/atoms/Avatar/Avatar'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import BackButton from '@/components/atoms/BackButton/BackButton'

function Account() {
  const [user, setuser] = useState({
    email_address: "",
    username: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    phone_number: "",
    password: "",
    id: "",
    avatar: ""
  });

  const getProfile = async () => {
    const response = await axios.get('/api/auth/PROFILE')
    setuser(response.data)
    console.log(response)
  }

  //esta funcion toma los datos del usuario y setea el usuario
  React.useEffect(() => {
    getProfile()
  }, [])


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setuser({
      ...user,
      [event.target.name]: event.target.value
    })
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setuser({
      ...user,
      avatar: event.target.value
    })
  }

  //manejar el cierre de sesion
  const router = useRouter()
  const logout = () => {
    const response = axios.post('/api/auth/logout')
    router.push('/login')
  }

  // obtenemos el perfil del usuario desde cookies y lo seteamos en el estado


  const updateProfile = async () => {
    const response = await axios.put('/api/users/update', user)
    console.log(response.data)
    if (response.status === 200) {
      toast.success('Perfil actualizado')

      // Obtén un nuevo token después de actualizar el perfil
      const id = user.id
      const authResponse = await axios.post('/api/users/refreshToken', id)
      if (authResponse.status === 200) {
        // Guarda el nuevo token en las cookies
        toast.success('Token actualizado')
      }
    }
    // 

  }

  const Avatares = [
    "Black.png",
    "Dark.jpg",
    "DeepPurple.jpg",
    "Gas.png",
    "Japan.png",
    "ManaPurple.jpg",
    "OceanBlue.jpg",
    "Purple.png",
    "Red.jpg",
    "RiverBlue.jpg",
    "Temple.png",
    "Ventura.jpg",
    "Warm.png"
  ];

  return (
    <div className='flex justify-around items-center h-dvh p-16'>
      <section className='w-2/4'>
        <BackButton />
        <h1 className='font-bold text-5xl mb-20'>Account settings</h1>

        <div >
          <label className='font-bold' htmlFor="">First_name</label>
          <div className='flex gap-4'>
            <input onChange={handleChange} className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name="first_name" id="first_name" defaultValue={user.first_name} placeholder='first name' />
            <input onChange={handleChange} className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name='last_name' id='last_name' defaultValue={user.last_name} placeholder='last_name' />
          </div>
        </div>
        <label className='font-bold' htmlFor="email_address">Email</label>
        <input onChange={handleChange} className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="email" name="email_address" id="email_address" defaultValue={user.email_address} />
        <label className='font-bold' htmlFor="Password">Password</label>
        <input onChange={handleChange} className='w-full bg-customGray h-12 rounded-md  mb-4 p-2' type="text" name="Password" id="Password" defaultValue={user.password} />
        <label className='font-bold' htmlFor="BirthDate">Birth date</label>
        <input onChange={handleChange} className='w-full bg-customGray h-12 rounded-md cursor-not-allowed  mb-4 p-2' type="text" name='BirthDate' id='BirthDate' value={user.birth_date} disabled={true} />
        {/* Seleccion de avatar */}
        <div className="flex justify-around items-center gap-5 w-full mb-7">
          <div className="w-full">
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Selecciona un avatar: </label>
            <select onChange={handleSelect} id="countries" className="bg-customGray border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required>
              <option selected>Escoge uno</option>
              {Avatares.map((avatar, index) => {
                return <option key={index} value={avatar}>{avatar}</option>
              })}
            </select>
          </div>
          <Avatar width={100} avatarOption={user.avatar} />
        </div>
      </section>
      <section className='flex flex-col justify-around'>
        <Avatar avatarOption={user.avatar} width={350} />
        <button onClick={updateProfile} className="py-6 px-28 rounded-lg bg-customGreen hover:bg-lime-700 font-bold text-white mt-20">Guardar cambios</button>
        <button onClick={() => logout()} className=' text-red-600 font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 mt-5'>
          Cerrar Sesión
          <span className="material-symbols-outlined">
            logout
          </span>
        </button>
      </section>
    </div>
  )
}

export default Account
