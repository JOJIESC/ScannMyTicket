// Ruta: src/app/signup/page.tsx
'use client';

import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [adduser, setAddUser] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    password: "",
    phone_number: "", // Opcional
    birth_date: "",
    avatar: "Black.png",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddUser({
      ...adduser,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (adduser.password.length < 6) {
      toast.warn("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      // Crear usuario
      const registerRes = await axios.post('/api/users/new', adduser);
      if (registerRes.status === 201) {
        toast.success('Usuario creado, iniciando sesión.');

        // Iniciar sesión automáticamente
        const loginRes = await axios.post('/api/auth/login', {
          email: adduser.email_address,
          password: adduser.password
        });

        if (loginRes.status === 200) {
          window.location.href = '/User'; // el middleware decide la ruta
        } else {
          toast.error('Error al iniciar sesión después del registro.');
        }
      }
    } catch (error: any) {
      console.error("Error en signup:", error);
      const message = error?.response?.data?.message || 'Ocurrió un error durante el registro.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  const form = useRef<HTMLFormElement>(null);

  const Avatares = [
    "Black.png", "Dark.jpg", "DeepPurple.jpg", "Gas.png", "Japan.png",
    "ManaPurple.jpg", "OceanBlue.jpg", "Purple.png", "Red.jpg",
    "RiverBlue.jpg", "Temple.png", "Ventura.jpg", "Warm.png"
  ];

  return (
    <main className="flex flex-col min-h-screen w-full bg-white p-6">
      <form ref={form} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>
        <input className="w-full border rounded p-2" placeholder="Correo" name="email_address" type="email" onChange={handleChange} required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="w-full border rounded p-2" placeholder="Nombre" name="first_name" onChange={handleChange} required />
          <input className="w-full border rounded p-2" placeholder="Apellido" name="last_name" onChange={handleChange} required />
        </div>
        <input className="w-full border rounded p-2" placeholder="Teléfono" name="phone_number" onChange={handleChange} />
        <input className="w-full border rounded p-2" placeholder="Fecha de nacimiento" name="birth_date" type="date" onChange={handleChange} />
        <select className="w-full border rounded p-2" name="avatar" value={adduser.avatar} onChange={handleChange}>
          {Avatares.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input className="w-full border rounded p-2" placeholder="Contraseña" name="password" type="password" onChange={handleChange} required />
        <button disabled={isLoading} className="px-4 py-2 rounded bg-black text-white">{isLoading ? 'Creando…' : 'Registrarme'}</button>
        <p className="text-sm">¿Ya tienes cuenta? <Link href="/login" className="underline">Inicia sesión</Link></p>
      </form>
    </main>
  );
}
