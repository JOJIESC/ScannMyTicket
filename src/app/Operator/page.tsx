// src/app/Operator/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OperatorScansPanel from '@/components/operator/OperatorScansPanel';

export default function OperatorHome() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Sólo para validar sesión
        await axios.get('/api/auth/PROFILE');
        setOk(true);
      } catch {
        setOk(false);
      }
    })();
  }, []);

  if (!ok) return <div className="p-4">Cargando…</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">Panel del Operador</h1>
      <OperatorScansPanel />
    </div>
  );
}
