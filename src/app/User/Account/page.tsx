'use client';

import React, { useEffect, useState } from 'react';
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
  const { data: profile, loading, error } = useProfile();

  const [form, setForm] = useState({
    email_address: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone_number: '',
    password: '', // nueva contraseña (opcional)
    id: '',
    avatar: 'Black.png'
  });

  useEffect(() => {
    if (!profile) return;
    setForm(f => ({
      ...f,
      email_address: profile.email_address || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      birth_date: profile.birth_date || '',
      phone_number: profile.phone_number || '',
      id: String(profile.id || ''),
      avatar: profile.avatar || 'Black.png',
      password: ''
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.id) {
      toast.error('No hay usuario cargado');
      return;
    }

    const payload: any = { id: Number(form.id) };

    // Solo enviar campos necesarios
    for (const k of ['email_address','first_name','last_name','phone_number','avatar']) {
      if ((form as any)[k] !== undefined) payload[k] = (form as any)[k];
    }
    if (form.birth_date !== undefined) payload.birth_date = form.birth_date;
    if (form.password && form.password.length >= 6) {
      payload.password = form.password;
    }

    try {
      const res = await http.put('/api/users/update', payload);
      if (res.status === 200) {
        // refrescar la cookie con los nuevos datos
        await http.post('/api/users/refreshToken', { id: Number(form.id) });
        toast.success('Perfil actualizado');
      } else {
        toast.warn('No se aplicaron cambios');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error actualizando el perfil';
      toast.error(msg);
    }
  };

  if (loading) return <main className="p-6">Cargando…</main>;
  if (error)   return <main className="p-6">Error: {error}</main>;

  return (
    <main className="flex flex-col min-h-screen w-full">
      <BackButton />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Mi cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Apellido</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Correo</label>
              <input
                type="email"
                name="email_address"
                value={form.email_address}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Fecha de nacimiento</label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date || ''}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nuevo password (opcional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded p-2"
                placeholder="Dejar vacío para no cambiar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <select value={form.avatar} onChange={handleAvatar} className="w-full border rounded p-2">
                {AVATARS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 rounded bg-black text-white">Guardar cambios</button>
            <button type="button" onClick={logout} className="px-4 py-2 rounded border">Cerrar sesión</button>
          </div>
        </form>
      </div>
    </main>
  );
}
