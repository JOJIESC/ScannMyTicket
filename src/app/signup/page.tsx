'use client'

import Image from "next/image"
import {useRef, useState} from "react"
import axios from "axios"
import {useRouter} from "next/navigation"

function signup() {
  const router = useRouter()
  const [adduser, setadduser] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "",
    birth_date: "",
  
  })
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value, event.target.name);
    
    setadduser({
      ...adduser,
      // los keys de la tabla seran los nombres de los inputs y sus valores seran los correspondientes
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(adduser);
    const res = await axios.post(`/api/users/new`, adduser)
    console.log(res);
    if (form.current) {
      (form.current as HTMLFormElement).reset()
    }
    //redireccionamos despues de crear al usuario
    await axios.post('/api/auth/login', {email: adduser.email_address, password: adduser.password})
   router.push("/User")
  }

  const form = useRef<HTMLFormElement>(null)


//estilos de inputs y labels
  const inputStyles = "w-full bg-customGray h-12 rounded-md  mb-4 p-2"
  const labelStyles = "font-bold flex justify-start w-full"
  return (
    <main className="grid grid-cols-2 w-full h-full justify-center items-center">
      <div className="flex justify-center flex-col w-full  px-10">
        <form ref={form} onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-1 w-full">
            <div className="w-[90%]">
              <label className={labelStyles} htmlFor="first_name">Nombre</label>
              <input className={inputStyles} type="text" placeholder="Nombre" name="first_name" onChange={handleChange} required/>
            </div>
            <div className="w-[90%]">
              <label className={labelStyles} htmlFor="last_name">Apellio</label>
              <input className={inputStyles} type="text" placeholder="Apellido" name="last_name" onChange={handleChange} required/>
            </div>
          </div>
          <label className={labelStyles} htmlFor="email_address">Correo</label>
          <input className={inputStyles} type="email" placeholder="Correo" name="email_address" onChange={handleChange} required/>
          <label className={labelStyles} htmlFor="password">Contraseña</label>
          <input className={inputStyles} type="password" placeholder="Contraseña" name="password" onChange={handleChange} required/>
          <label className={labelStyles} htmlFor="phone_number">Número de telefono</label>
          <input className={inputStyles} type="text" placeholder="Número de telefono" name="phone_number" onChange={handleChange} required/>
          <label className={labelStyles} htmlFor="birth_date">Fecha de nacimiento</label>
          <input className={inputStyles} type="date" placeholder="Fecha de nacimiento" name="birth_date" onChange={handleChange} required/>
        <button type="submit" className="text-black bg-customGreen rounded-lg w-[315px] h-16">Sign up</button>
        </form>
        <p className="mt-4 text-sm text-center text-black">
                    ¿Ya tienes una cuenta? <a href="/login" className="font-bold hover:text-customGreen">Inicia Sesión</a>
                </p>
      </div>
      <div className="flex justify-center items-center flex-col">
        <h1 className="w-full flex justify-center font-bold text-5xl pb-16">Registrate</h1>
        <Image className="flex justify-center mb-10" src="/img/registro.png" alt="imagen de registro" width={500} height={200} />
      </div>
    </main>
  )
}
export default signup
