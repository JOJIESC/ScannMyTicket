'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BackButton from '@/components/atoms/BackButton/BackButton';
import { http } from '@/libs/http';
import { Event } from '@/types';
import { toast } from 'react-toastify';

async function fetchEvent(id: number) {
  const { data } = await http.get(`/api/events/${id}`);
  return data as Event;
}
async function fetchProfile() {
  const { data } = await http.get('/api/auth/PROFILE');
  return data;
}
async function subscribe(payload: { userID: number; eventID: number }) {
  return http.post('/api/events/subscribe', payload);
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [evento, setEvento] = useState<Event | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [busy, setBusy]     = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ev, prof] = await Promise.all([
          fetchEvent(Number(params.id)),
          fetchProfile(),
        ]);
        if (!alive) return;
        setEvento(ev);
        setUserID(prof.id);
      } catch {
        toast.error('Error cargando datos');
      }
    })();
    return () => { alive = false; };
  }, [params.id]);

  const handleSubscribe = async () => {
    if (!userID || !evento) return toast.error('No se pudo suscribir');
    setBusy(true);
    try {
      const res = await subscribe({ userID, eventID: Number(params.id) });
      if (res.status === 200) toast.success('Te has suscrito al evento');
      else if (res.status === 201 || res.status === 409) toast.warn('Ya estás suscrito a este evento');
      else toast.info('Estado de suscripción actualizado');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Error al suscribirse');
    } finally {
      setBusy(false);
    }
  };

  if (!evento) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="w-56 h-56 border rounded-lg flex items-center justify-center">Cargando…</div>
      </div>
    );
  }

  return (
    <main className="flex justify-around w-full h-full py-28 px-20 gap-8">
      <div className="flex flex-col gap-8">
        <BackButton />
        <Image className="h-80 w-auto rounded-lg" src={evento.image_url} alt={evento.title} width={500} height={200} />
        <div>
          <h3 className="font-bold text-2xl">Descripción:</h3>
          <p>{evento.description}</p>
        </div>
        <div>
          <h3 className="font-bold text-2xl">Ubicación:</h3>
          <p>{evento.location}</p>
        </div>
      </div>

      <div className="flex flex-col max-w-[340px] gap-8">
        <div>
          <h1 className="flex font-bold text-4xl">Evento:</h1>
          <h1 className="flex font-bold text-4xl">{evento.title}</h1>
        </div>

        <section className="flex flex-col gap-5 text-2xl">
          <h2 className="flex items-center font-bold">Info<span className="material-symbols-outlined">info</span></h2>
          <div>
            <p className="font-bold">Fecha de inicio:</p>
            <p>{String(evento.start)}</p>
            <p>Hora inicio: {evento.startTime}</p>
          </div>
          <div>
            <p className="font-bold">Fecha de conclusión:</p>
            <p>{String(evento.end)}</p>
            <p>Hora de conclusión: {evento.endTime}</p>
          </div>
        </section>

        <div className="flex justify-center">
          <button onClick={handleSubscribe} disabled={busy}
            className="py-6 px-28 rounded-lg bg-customGreen hover:bg-lime-600 disabled:opacity-60">
            {busy ? 'Procesando…' : 'Suscribirse'}
          </button>
        </div>
      </div>
    </main>
  );
}
