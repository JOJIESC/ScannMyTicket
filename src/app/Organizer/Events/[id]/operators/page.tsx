'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import Loader from "@/components/Loader";

type Operator = { id: number; email: string };

export default function OperatorsPage({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const [operators, setOperators] = useState<Operator[] | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    try {
      const { data } = await axios.get(`/api/operators/by-event/${eventId}`);
      setOperators(data || []);
    } catch {
      setOperators([]);
      toast.error("No se pudieron obtener operadores");
    }
  };

  useEffect(() => {
    load();
  }, [eventId]);

  const addOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Completa correo y contraseña");
      return;
    }
    try {
      const payload = [{ email, password, event_id: Number(eventId) }];
      const res = await axios.post("/api/events/postOperator", payload);
      if (res.status === 200) {
        toast.success("Operador agregado");
        setEmail("");
        setPassword("");
        await load();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "No se pudo agregar");
    }
  };

  const deleteOperator = async (operatorId: number) => {
    if (!confirm("¿Eliminar este operador?")) return;
    try {
      const res = await axios.delete(`/api/operators/${operatorId}`);
      if (res.status === 200) {
        toast.success("Operador eliminado");
        setOperators((prev) => (prev ? prev.filter((o) => o.id !== operatorId) : prev));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "No se pudo eliminar");
    }
  };

  if (!operators) return <Loader />;

  return (
    <div className="max-w-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Operadores del evento #{eventId}</h1>
        <Link href={`/Organizer/Events/${eventId}/edit`} className="px-4 py-2 rounded bg-gray-200">Volver a edición</Link>
      </div>

      <form onSubmit={addOperator} className="border rounded p-4 mb-6 grid md:grid-cols-3 gap-3 bg-white">
        <input
          className="border rounded p-2"
          placeholder="Correo del operador"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Contraseña"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="rounded bg-black text-white px-4">Agregar</button>
      </form>

      {operators.length === 0 ? (
        <div className="text-gray-600">No hay operadores aún.</div>
      ) : (
        <div className="bg-white border rounded">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op) => (
                <tr key={op.id} className="border-b">
                  <td className="p-3">{op.id}</td>
                  <td className="p-3">{op.email}</td>
                  <td className="p-3 text-right">
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white"
                      onClick={() => deleteOperator(op.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
