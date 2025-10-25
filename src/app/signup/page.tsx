'use client'

import Image from "next/image"
import { useRef, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Avatar from "@/components/atoms/Avatar/Avatar"

function signup() {
  const router = useRouter()
  const [adduser, setadduser] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "",
    birth_date: "",
    avatar: "",

  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value, event.target.name);

    setadduser({
      ...adduser,
      // los keys de la tabla seran los nombres de los inputs y sus valores seran los correspondientes
      [event.target.name]: event.target.value
    })
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    setadduser({
      ...adduser,
      avatar: event.target.value
    })
  }

  // En /src/app/signup/page.tsx

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // 1. Registra al nuevo usuario
      const res = await axios.post(`/api/users/new`, adduser);

      if (res.status === 200) {
        toast.success('Usuario creado, iniciando sesión...');

        // 2. Inicia sesión con el nuevo usuario para obtener la cookie
        const loginResponse = await axios.post('/api/auth/login', {
          email: adduser.email_address,
          password: adduser.password
        });

        // 3. Si el inicio de sesión es exitoso, redirige
        if (loginResponse.status === 200) {
          // Usamos el mismo método: dejamos que el middleware haga el trabajo
          window.location.href = '/User';
        }
      }
    } catch (error) {
      toast.error('Ocurrió un error durante el registro.');
      console.log(error);
    }
  }
  const form = useRef<HTMLFormElement>(null)

  //estilos de inputs y labels
  const inputStyles = "w-full bg-customGray h-12 rounded-md  mb-4 p-2"
  const labelStyles = "font-bold flex justify-start w-full"

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
    <main className="grid grid-cols-2 w-full h-full justify-center items-center">
      <div className="flex justify-center flex-col w-full  px-10">
        <form ref={form} onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-1 w-full">
            <div className="w-[90%]">
              <label className={labelStyles} htmlFor="first_name">Nombre</label>
              <input className={inputStyles} type="text" placeholder="Nombre" name="first_name" onChange={handleChange} required />
            </div>
            <div className="w-[90%]">
              <label className={labelStyles} htmlFor="last_name">Apellio</label>
              <input className={inputStyles} type="text" placeholder="Apellido" name="last_name" onChange={handleChange} required />
            </div>
          </div>
          <label className={labelStyles} htmlFor="email_address">Correo</label>
          <input className={inputStyles} type="email" placeholder="Correo" name="email_address" onChange={handleChange} required />
          <label className={labelStyles} htmlFor="password">Contraseña</label>
          <input className={inputStyles} type="password" placeholder="Contraseña" name="password" onChange={handleChange} required />
          <label className={labelStyles} htmlFor="phone_number">Número de telefono</label>
          <input className={inputStyles} type="text" placeholder="Número de telefono" name="phone_number" onChange={handleChange} required />
          <label className={labelStyles} htmlFor="birth_date">Fecha de nacimiento</label>
          <input className={inputStyles} type="date" placeholder="Fecha de nacimiento" name="birth_date" onChange={handleChange} required />

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
            <Avatar width={100} avatarOption={adduser.avatar} />
          </div>


          <button type="submit" className="text-black bg-customGreen rounded-lg w-[315px] h-16">Sign up</button>
        </form>
        <p className="mt-4 text-sm text-center text-black">
          ¿Ya tienes una cuenta? <a href="/login" className="font-bold hover:text-customGreen">Inicia Sesión</a>
        </p>

      </div>
      <div className="flex justify-center items-center flex-col">
        <h1 className="w-full flex justify-center font-bold text-5xl pb-16">Registrate</h1>
        <Image className="flex justify-center mb-10" src="/img/registro.png" alt="imagen de registro" width={500} height={200} />
        <a className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base text-center font-bold rounded-lg text-indigo-500 hover:text-customGreen focus:ring-4 focus:ring-primary-300" href="/">Regresar</a>
      </div>
    </main>
  )
}
export default signup
