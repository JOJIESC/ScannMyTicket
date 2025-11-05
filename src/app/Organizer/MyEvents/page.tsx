'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";

type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  location: string;
};

export default function MyEvents() {
  const [user, setUser] = useState<{ id: string }>({ id: "" });
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/auth/PROFILE');
      setUser({ id: data.id });
    })();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    (async () => {
      try {
        const res = await axios.post('/api/organizers/getMyEvents', { user_id: user.id });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "Error cargando mis eventos");
      } finally {
        setLoading(false);
      }
    })();
  }, [user.id]);

  if (loading) return <div className="p-6">Cargando…</div>;

  if (!events.length) {
    return <div className="p-6 text-gray-600">No tienes eventos todavía.</div>;
  }

  return (
    <main className="p-6 grid gap-4">
      <h1 className="text-3xl font-bold mb-2">Mis eventos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map(ev => (
          <div key={ev.id} className="rounded-xl border p-4">
            <h3 className="font-semibold text-lg">{ev.title}</h3>
            <p className="text-sm text-gray-500">{ev.location}</p>
            <p className="text-xs text-gray-500">{ev.start} → {ev.end}</p>
            <div className="mt-3 flex gap-2">
              <Link className="px-3 py-1 rounded bg-purple-600 text-white"
                    href={`/Organizer/MyEvents/${ev.id}`}>Gestionar</Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
