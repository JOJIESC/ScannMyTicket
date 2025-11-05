// src/components/atoms/OperatorScansPanel/OperatorScansPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Row = {
  id: number;
  scanned_at: string;
  result: 'success' | 'repeated' | 'invalid';
  event_id: number;
  subscription_id: number;
  subscriber_id: number;
  subscriber_email?: string;
};

export default function OperatorScansPanel({ eventId }: { eventId?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const url = eventId
        ? `/api/operators/scans/recent?eventId=${eventId}`
        : '/api/operators/scans/recent';
      const { data } = await axios.get(url);
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (e) {
      console.error('load scans error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [eventId]);

  // refresco en vivo tras escaneo (QRReader dispara este evento) :contentReference[oaicite:4]{index=4}
  useEffect(() => {
    const fn = (ev: any) => {
      if (!eventId || Number(ev?.detail?.eventId) === Number(eventId)) {
        fetchRows();
      }
    };
    window.addEventListener('scan:updated', fn as any);
    return () => window.removeEventListener('scan:updated', fn as any);
  }, [eventId]);

  if (loading) return <div className="text-sm">Cargando historial…</div>;
  if (!rows.length) return <div className="text-sm">Sin escaneos recientes</div>;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Últimos escaneos</h3>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex justify-between items-center rounded border px-3 py-2 bg-white"
          >
            <div className="text-sm">
              <div>
                <b>Resultado:</b> {r.result}
              </div>
              <div>
                <b>Suscriptor:</b> {r.subscriber_email || r.subscriber_id}
              </div>
              <div className="text-gray-500">
                {new Date(r.scanned_at).toLocaleString()} — Evento #{r.event_id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
