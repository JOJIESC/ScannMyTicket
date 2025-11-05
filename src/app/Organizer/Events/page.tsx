'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";

type EventT = {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  startTime?: string;
  endTime?: string;
  location: string;
  image_url?: string;
};

export default function MyEvents() {
  const [user, setUser] = useState<{ id: string }>({ id: "" });
  const [events, setEvents] = useState<EventT[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/auth/PROFILE");
        setUser({ id: data.id });
      } catch {
        toast.error("No se pudo leer el perfil");
      }
    })();
  }, []);

  useEffect(() => {
    if (!user.id) return;
    (async () => {
      try {
        const res = await axios.post("/api/organizers/getMyEvents", { user_id: user.id });
        setEvents(res.data || []);
      } catch {
        toast.error("No se pudieron obtener tus eventos");
      }
    })();
  }, [user.id]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este evento? Esta acción es irreversible.")) return;
    try {
      const res = await axios.delete(`/api/events/${id}`);
      if (res.status === 200) {
        toast.success("Evento eliminado");
        setEvents((prev) => (prev ? prev.filter((e) => e.id !== id) : prev));
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (!events) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-black font-bold text-4xl">Mis eventos</h1>
        <Link className="px-4 py-2 rounded bg-black text-white" href="/Organizer/AddEvent">
          + Crear evento
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-600">Aún no tienes eventos.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-lg border p-4 bg-white flex flex-col gap-3">
              <div className="font-bold text-lg">{ev.title}</div>
              <div className="text-sm text-gray-600">{ev.location}</div>
              <div className="text-xs text-gray-500">
                {ev.start} {ev.startTime ? `(${ev.startTime})` : ""} — {ev.end} {ev.endTime ? `(${ev.endTime})` : ""}
              </div>

              <div className="flex gap-2 mt-2">
                <Link className="px-3 py-1 rounded bg-indigo-600 text-white" href={`/Organizer/Events/${ev.id}/edit`}>Editar</Link>
                <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => handleDelete(ev.id)}>Eliminar</button>
                <Link className="px-3 py-1 rounded bg-gray-200" href={`/Organizer/Events/${ev.id}/operators`}>Operadores</Link>
                <Link className="px-3 py-1 rounded bg-gray-200" href={`/Organizer/Events/${ev.id}`}>Ver</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
