"use client";
import React, { useEffect, useMemo, useState } from "react";
import EventCard from "@/components/molecules/EventCard/EventCard";

type Event = {
  id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  start: string;
  end: string;
};

function normalize(payload: any): Event[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export default function UserEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/events", { cache: "no-store" });
        const raw = await res.json().catch(() => []);
        const list = normalize(raw);
        if (!res.ok) setErr(typeof raw?.message === "string" ? raw.message : `Error ${res.status}`);
        setEvents(list);
      } catch {
        setErr("No se pudieron cargar los eventos");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? events.filter(e => e.title?.toLowerCase().includes(s)) : events;
  }, [events, q]);

  if (loading) return <main className="p-6">Cargando eventos…</main>;

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <input
          placeholder="Buscar…"
          className="bg-gray-100 rounded px-3 py-2 w-72"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {err ? <p className="text-sm text-red-600 mb-2">{err}</p> : null}

      {filtered.length === 0 ? (
        <p className="text-gray-500">No hay eventos disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ev) => (
            <EventCard
              key={ev.id}
              id={ev.id}
              title={ev.title}
              description={ev.description ?? ""}
              image_url={ev.image_url ?? ""}
              location={ev.location ?? ""}
              start={ev.start}
              end={ev.end}
            />
          ))}
        </div>
      )}
    </main>
  );
}
