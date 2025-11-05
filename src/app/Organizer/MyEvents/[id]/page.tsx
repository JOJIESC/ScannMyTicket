'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Event = {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  location: string;
  start: string;
  end: string;
  startTime?: string | null;
  endTime?: string | null;
};

type Operator = { id: number; email_address: string; event_id: number };

type Subscriber = {
  subscription_id: number;
  subscriber_id: number;
  email_address: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  expires_at: string | null;
  used_at: string | null;
  used_by_operator_email: string | null;
};

export default function ManageEvent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [ops, setOps] = useState<Operator[]>([]);
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOp, setNewOp] = useState({ email: "", password: "" });

  // cargar evento + operadores + suscriptores
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/events/${params.id}`);
        setEvent(data);
      } catch (e: any) {
        toast.error(e?.response?.data?.message || "No se pudo cargar el evento");
      }
      try {
        const { data } = await axios.get(`/api/organizers/events/${params.id}/operators`);
        setOps(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('fetchOperators error:', err?.response?.status, err?.response?.data);
        setOps([]);
      }
      try {
        const { data } = await axios.get(`/api/organizers/events/${params.id}/subscribers`);
        setSubs(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('fetchSubscribers error:', err?.response?.status, err?.response?.data);
        setSubs([]);
      }
      setLoading(false);
    })();
  }, [params.id]);

  async function handleSave() {
    try {
      await axios.put(`/api/organizers/events/${params.id}`, event);
      toast.success("Evento actualizado");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Error actualizando evento");
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este evento? Esta acción no se puede deshacer.")) return;
    try {
      await axios.delete(`/api/organizers/events/${params.id}`);
      toast.success("Evento eliminado");
      router.push("/Organizer/MyEvents");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Error eliminando evento");
    }
  }

  async function addOperator() {
    if (!newOp.email.trim()) return toast.warn("Ingresa un correo");
    try {
      await axios.post(`/api/organizers/events/${params.id}/operators`, {
        email: newOp.email.trim(),
        password: newOp.password || "123456"
      });
      setNewOp({ email: "", password: "" });
      const { data } = await axios.get(`/api/organizers/events/${params.id}/operators`);
      setOps(Array.isArray(data) ? data : []);
      toast.success("Operador agregado");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "No se pudo agregar operador");
    }
  }

  async function removeOperator(opId: number) {
    if (!confirm("¿Eliminar este operador?")) return;
    try {
      await axios.delete(`/api/organizers/events/${params.id}/operators/${opId}`);
      setOps(prev => prev.filter(o => o.id !== opId));
      toast.success("Operador eliminado");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "No se pudo eliminar el operador");
    }
  }

  async function revokeSubscription(subscription_id: number) {
    if (!confirm("¿Revocar esta suscripción?")) return;
    try {
      await axios.delete(`/api/organizers/events/${params.id}/subscribers/${subscription_id}`);
      setSubs(prev => prev.filter(s => s.subscription_id !== subscription_id));
      toast.success("Suscripción revocada");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "No se pudo revocar");
    }
  }

  if (loading) return <div className="p-6">Cargando…</div>;
  if (!event) return <div className="p-6">Evento no encontrado.</div>;

  return (
    <main className="p-6 grid gap-8">
      {/* Editar / Eliminar */}
      <section className="grid gap-3">
        <h1 className="text-2xl font-bold">Editar evento</h1>
        <div className="grid gap-2 max-w-2xl">
          <input className="border rounded p-2" placeholder="Título"
                 value={event.title || ""} onChange={e => setEvent({ ...event!, title: e.target.value })} />
          <input className="border rounded p-2" placeholder="Ubicación"
                 value={event.location || ""} onChange={e => setEvent({ ...event!, location: e.target.value })} />
          <textarea className="border rounded p-2" placeholder="Descripción"
                    value={event.description || ""} onChange={e => setEvent({ ...event!, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded p-2" type="datetime-local" placeholder="Inicio"
                   value={event.start?.slice(0, 16) || ""} onChange={e => setEvent({ ...event!, start: e.target.value })} />
            <input className="border rounded p-2" type="datetime-local" placeholder="Fin"
                   value={event.end?.slice(0, 16) || ""} onChange={e => setEvent({ ...event!, end: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded bg-purple-600 text-white">Guardar</button>
            <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">Eliminar</button>
          </div>
        </div>
      </section>

      {/* Operadores */}
      <section className="grid gap-3">
        <h2 className="text-xl font-bold">Operadores</h2>
        <div className="flex gap-2 max-w-xl">
          <input className="border rounded p-2 flex-1" placeholder="Correo" value={newOp.email}
                 onChange={e => setNewOp({ ...newOp, email: e.target.value })} />
          <input className="border rounded p-2 w-48" placeholder="Contraseña (opcional)" value={newOp.password}
                 onChange={e => setNewOp({ ...newOp, password: e.target.value })} />
          <button onClick={addOperator} className="px-4 py-2 rounded bg-purple-600 text-white">Añadir</button>
        </div>
        {!ops.length ? (
          <p className="text-gray-600">No hay operadores para este evento.</p>
        ) : (
          <ul className="grid gap-2">
            {ops.map(op => (
              <li key={op.id} className="flex items-center justify-between border rounded p-2">
                <span>{op.email_address}</span>
                <button onClick={() => removeOperator(op.id)} className="px-3 py-1 rounded bg-red-600 text-white">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Suscriptores */}
      <section className="grid gap-3">
        <h2 className="text-xl font-bold">Suscriptores</h2>
        {!subs.length ? (
          <p className="text-gray-600">Este evento aún no tiene suscriptores.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Creado</th>
                  <th className="text-left p-2">Usado</th>
                  <th className="text-left p-2">Operador</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.subscription_id} className="border-t">
                    <td className="p-2">{[s.first_name, s.last_name].filter(Boolean).join(' ') || '—'}</td>
                    <td className="p-2">{s.email_address}</td>
                    <td className="p-2">{s.created_at ? new Date(s.created_at).toLocaleString() : '—'}</td>
                    <td className="p-2">{s.used_at ? new Date(s.used_at).toLocaleString() : '—'}</td>
                    <td className="p-2">{s.used_by_operator_email || '—'}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => revokeSubscription(s.subscription_id)}
                              className="px-3 py-1 rounded bg-red-600 text-white">
                        Revocar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
