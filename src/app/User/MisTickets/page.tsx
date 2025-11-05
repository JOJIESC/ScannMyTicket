'use client';
import React, { useEffect, useState } from 'react';
import Ticket from '@/components/molecules/Ticket/Ticket';

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  image_url: string;
}

export default function MyTickets() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/subscriptions', { credentials: 'include' });
        const data = await res.json();
        if (!alive) return;
        if (Array.isArray(data)) setEvents(data);
        else setError('Respuesta inesperada del servidor');
      } catch (e) {
        if (alive) setError('Error obteniendo tus tickets');
      }
    })();
    return () => { alive = false; };
  }, []);

  if (error)   return <div className="p-6">{error}</div>;
  if (!events) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="w-56 h-56 border rounded-lg flex items-center justify-center">Cargando…</div>
      </div>
    );
  }
  if (events.length === 0) return <div className="p-10">No tienes suscripciones.</div>;

  return (
    <div className="p-10">
      <div className="flex flex-row items-center mb-6">
        <img className="h-10" src="/img/codeQr.png" alt="" />
        <h1 className="text-4xl font-bold text-black ml-4">My Tickets</h1>
      </div>
      <div className="flex flex-wrap gap-6">
        {events.map(ev => <Ticket key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}
