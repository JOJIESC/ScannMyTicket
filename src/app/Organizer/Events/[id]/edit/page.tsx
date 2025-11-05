'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Loader from '@/components/Loader';

type EventForm = {
  id: number;
  title: string;
  description: string;
  start: string;
  startTime: string;
  end: string;
  endTime: string;
  location: string;
};

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<EventForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/events/${params.id}`);
        setForm({
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          start: data.start || '',
          startTime: data.startTime || '',
          end: data.end || '',
          endTime: data.endTime || '',
          location: data.location || '',
        });
      } catch {
        toast.error('No se pudo cargar el evento');
      }
    })();
  }, [params.id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => (s ? { ...s, [name]: value } : s));
  };

  const onSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        start: form.start,
        startTime: form.startTime,
        end: form.end,
        endTime: form.endTime,
        location: form.location,
      };
      const res = await axios.put(`/api/events/${params.id}`, payload);
      if (res.status === 200) toast.success('Evento actualizado');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'No se pudo actualizar');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Loader />;

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-4">Editar evento</h1>

      <label className="block text-sm font-medium mb-1">Título</label>
      <input className="w-full border rounded p-2 mb-3" name="title" value={form.title} onChange={onChange} />

      <label className="block text-sm font-medium mb-1">Descripción</label>
      <textarea className="w-full border rounded p-2 mb-3" name="description" value={form.description} onChange={onChange} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha inicio</label>
          <input type="date" className="w-full border rounded p-2" name="start" value={form.start} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hora inicio</label>
          <input type="time" className="w-full border rounded p-2" name="startTime" value={form.startTime} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha fin</label>
          <input type="date" className="w-full border rounded p-2" name="end" value={form.end} onChange={onChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hora fin</label>
          <input type="time" className="w-full border rounded p-2" name="endTime" value={form.endTime} onChange={onChange} />
        </div>
      </div>

      <label className="block text-sm font-medium mt-3 mb-1">Ubicación</label>
      <input className="w-full border rounded p-2 mb-6" name="location" value={form.location} onChange={onChange} />

      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded bg-black text-white">
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <Link className="px-4 py-2 rounded bg-gray-200" href={`/Organizer/Events/${params.id}`}>Cancelar</Link>
        <Link className="px-4 py-2 rounded bg-indigo-600 text-white" href={`/Organizer/Events/${params.id}/operators`}>Editar operadores</Link>
      </div>
    </div>
  );
}
