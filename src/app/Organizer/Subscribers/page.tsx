'use client';
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Row = {
  event_id: number;
  event_title: string;
  start: string;
  end: string;
  location: string;
  subscription_id: number | null;
  subscriber_name: string | null;
  subscriber_email: string | null;
  created_at: string | null;
  used_at: string | null;
  used_by_operator_email: string | null;
};

export default function Subscribers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/organizers/subscribers');
        setRows(Array.isArray(data) ? data : []);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "No se pudo cargar la lista");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(r =>
      (r.event_title || "").toLowerCase().includes(s) ||
      (r.subscriber_name || "").toLowerCase().includes(s) ||
      (r.subscriber_email || "").toLowerCase().includes(s)
    );
  }, [q, rows]);

  if (loading) return <div className="p-6">Cargando…</div>;

  // Agrupar por evento
  const groups = filtered.reduce((acc: Record<number, Row[]>, r) => {
    (acc[r.event_id] ||= []).push(r);
    return acc;
  }, {});

  return (
    <main className="p-6 grid gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Suscriptores</h1>
        <input className="border rounded p-2 flex-1" placeholder="Buscar por evento o suscriptor…" value={q}
               onChange={e => setQ(e.target.value)} />
      </div>

      {Object.keys(groups).length === 0 ? (
        <p className="text-gray-600">No hay suscripciones registradas.</p>
      ) : (
        Object.entries(groups).map(([eventId, rows]) => (
          <section key={eventId} className="grid gap-2 border rounded p-4">
            <h2 className="font-semibold text-lg">{rows[0].event_title}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Suscriptor</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Creado</th>
                    <th className="text-left p-2">Usado</th>
                    <th className="text-left p-2">Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={String(r.subscription_id) + "_" + String(r.subscriber_email)} className="border-t">
                      <td className="p-2">{r.subscriber_name || "—"}</td>
                      <td className="p-2">{r.subscriber_email || "—"}</td>
                      <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                      <td className="p-2">{r.used_at ? new Date(r.used_at).toLocaleString() : "—"}</td>
                      <td className="p-2">{r.used_by_operator_email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </main>
  );
}
