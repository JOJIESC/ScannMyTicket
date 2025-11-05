'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '@/components/atoms/Avatar/Avatar';
import BackButton from '@/components/atoms/BackButton/BackButton';
import { http } from '@/libs/http';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useProfile } from '@/hooks/useProfile';

const AVATARS = [
  "Black.png","Dark.jpg","DeepPurple.jpg","Gas.png","Japan.png",
  "ManaPurple.jpg","OceanBlue.jpg","Purple.png","Red.jpg",
  "RiverBlue.jpg","Temple.png","Ventura.jpg","Warm.png"
];

export default function Account() {
  const router = useRouter();
  const { data: profile, loading, error, refresh } = useProfile();

  const [form, setForm] = useState({
    email_address: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone_number: '',
    password: '',       // solo para NUEVA contraseña
    id: '',
    avatar: ''
  });

  // cargar perfil en formulario cuando llegue
  useEffect(() => {
    if (!profile) return;
    setForm(f => ({
      ...f,
      email_address: profile.email_address || '',
      first_name:    profile.first_name || '',
      last_name:     profile.last_name || '',
      birth_date:    profile.birth_date || '',
      phone_number:  profile.phone_number || '',
      id:            String(profile.id || ''),
      avatar:        profile.avatar || 'Black.png',
      password: '' // nunca poblamos con la contraseña actual
    }));
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, avatar: e.target.value }));
  };

  const logout = async () => {
    try {
      await http.post('/api/auth/logout');
    } finally {
      router.push('/login');
    }
  };

  const updateProfile = async () => {
    try {
      // construye payload solo con campos editables y no vacíos
      const payload: any = {
        id: form.id,
        email_address: form.email_address,
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        avatar: form.avatar,
      };
      if (form.password && form.password.length >= 6) {
        payload.password = form.password;
      }

      const res = await http.put('/api/users/update', payload);
      if (res.status === 200) {
        toast.success('Perfil actualizado');

        // refresh token
        try {
          await http.post('/api/users/refreshToken', { id: form.id }); // manda JSON, no el número suelto
          toast.success('Token actualizado');
        } catch {
          // si tu backend acepta el id "crudo", y prefieres eso, deja la versión anterior
        }

        await refresh();
        setForm(prev => ({ ...prev, password: '' }));
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Error actualizando perfil');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="w-56 h-56 border rounded-lg flex items-center justify-center">Cargando…</div>
      </div>
    );
  }
  if (error) return <div className="p-6">Error: {error}</div>;
  if (!profile) return <div className="p-6">No se pudo cargar el perfil.</div>;

  return (
    <div className='flex justify-around items-center h-dvh p-16'>
      <section className='w-2/4'>
        <BackButton />
        <h1 className='font-bold text-5xl mb-20'>Account settings</h1>

        <div>
          <label className='font-bold' htmlFor="first_name">First name</label>
          <div className='flex gap-4'>
            <input className='w-full bg-customGray h-12 rounded-md mb-4 p-2'
              type="text" name="first_name" id="first_name"
              value={form.first_name} onChange={handleChange} placeholder='first name' />
            <input className='w-full bg-customGray h-12 rounded-md mb-4 p-2'
              type="text" name='last_name' id='last_name'
              value={form.last_name} onChange={handleChange} placeholder='last name' />
          </div>
        </div>

        <label className='font-bold' htmlFor="email_address">Email</label>
        <input className='w-full bg-customGray h-12 rounded-md mb-4 p-2'
          type="email" name="email_address" id="email_address"
          value={form.email_address} onChange={handleChange} />

        <label className='font-bold' htmlFor="password">New password</label>
        <input className='w-full bg-customGray h-12 rounded-md mb-4 p-2'
          type="password" name="password" id="password"
          value={form.password} onChange={handleChange}
          placeholder="•••••• (opcional)" />

        <label className='font-bold' htmlFor="birth_date">Birth date</label>
        <input className='w-full bg-customGray h-12 rounded-md cursor-not-allowed mb-4 p-2'
          type="text" name='birth_date' id='birth_date'
          value={form.birth_date || ''} disabled />

        <div className="flex justify-around items-center gap-5 w-full mb-7">
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium text-gray-900">Selecciona un avatar</label>
            <select value={form.avatar} onChange={handleAvatar}
              className="bg-customGray border text-gray-900 text-sm rounded-lg block w-full p-2.5">
              {AVATARS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <Avatar width={100} avatarOption={form.avatar} />
        </div>
      </section>

      <section className='flex flex-col justify-around'>
        <Avatar avatarOption={form.avatar} width={350} />
        <button onClick={updateProfile}
          className="flex mt-8 justify-center bg-customGreen rounded text-black font-bold p-2 w-full hover:scale-105 transition">
          Guardar cambios
        </button>
        <button onClick={logout}
          className='text-red-600 font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 mt-5'>
          Cerrar Sesión
          <span className="material-symbols-outlined">logout</span>
        </button>
      </section>
    </div>
  );
}
