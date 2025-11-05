'use client';
import React, { useEffect, useState } from 'react';
import EventCard from '@/components/molecules/EventCard/EventCard';
import { http } from '@/libs/http';
import { Event } from '@/types';

export default function Events() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get('/api/events');
        if (alive) setEvents(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.message || 'Error cargando eventos');
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

  return (
    <main className="mx-12 my-3">
      <h1 className="text-black font-sans font-bold text-5xl my-10">Eventos</h1>
      <div className="flex flex-wrap gap-2 justify-center">
        {events.map(ev => (
          <EventCard
            key={ev.id}
            title={ev.title}
            event_id={ev.id}
            start={ev.start}
            end={ev.end}
            startTime={ev.startTime}
            endTime={ev.endTime}
            location={ev.location}
            image_url={ev.image_url}
          />
        ))}
      </div>
    </main>
  );
}
