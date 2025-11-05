// src/app/Operator/Scanner/[event_id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import QrReaderComponent from '@/components/atoms/QrReader/QrReader';
import OperatorScansPanel from '@/components/operator/OperatorScansPanel';

export default function Scanner() {
  const params = useParams();
  const eventId: number = Array.isArray(params.event_id)
    ? Number(params.event_id[0])
    : Number(params.event_id);

  const [user, setUser] = useState<{ email_address: string }>({ email_address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/api/auth/PROFILE');
        setUser(data);
      } catch (e) {
        console.error('PROFILE error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="p-4 grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold mb-3">Scan QR Code</h1>
        <QrReaderComponent
          className="w-full"
          event_id={eventId}
          operator_email={user.email_address}
        />
        <p className="text-xs mt-2 text-gray-600">
          Si el escáner deja de escanear, refresca la página.
        </p>
      </div>
      <OperatorScansPanel eventId={eventId} />
    </div>
  );
}
