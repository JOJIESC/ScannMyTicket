// src/components/atoms/QrReader/QrReader.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false }) as any;

type Props = {
  className?: string;
  event_id: number | string;
  operator_email: string;
};

export default function QrReaderComponent({ className, event_id, operator_email }: Props) {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const busyRef = useRef(false);

  // ✅ Debe ser MediaStreamConstraints, con video definido (y audio false)
  const streamConstraints: MediaStreamConstraints = {
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  };

  const handleScan = (data: any) => {
    if (!data || !data.text) return;
    if (busyRef.current) return; // throttle
    busyRef.current = true;
    setScanResult(data.text);
  };

  const handleError = (err: any) => {
    console.error('QR error:', err);
    // Mensajes más claros de permisos/https
    if (typeof window !== 'undefined') {
      const isHttps = location.protocol === 'https:' || location.hostname === 'localhost';
      if (!isHttps) toast.error('La cámara requiere HTTPS o localhost.');
      else toast.error('No se pudo acceder a la cámara. Revisa permisos.');
    }
  };

  useEffect(() => {
    if (!scanResult) return;
    (async () => {
      try {
        const res = await axios.post('/api/operator/scan', {
          event_id: Number(event_id),
          operator_email,
          qr_raw: scanResult,
        });

        if (res.status === 200) {
          toast.success('✅ Ticket validado');
          window.dispatchEvent(
            new CustomEvent('scan:updated', { detail: { eventId: Number(event_id) } }),
          );
        } else {
          toast.error('Error inesperado al validar');
        }
      } catch (e: any) {
        const msg = e?.response?.data?.message || 'Error al validar';
        const code = e?.response?.status;
        if (code === 409) toast.info('⚠️ Ticket repetido');
        else if (code === 410) toast.warn('⏱️ Ticket caducado');
        else toast.error(`❌ ${msg}`);
      } finally {
        setTimeout(() => {
          busyRef.current = false;
          setScanResult(null);
        }, 1500);
      }
    })();
  }, [scanResult, event_id, operator_email]);

  return (
    <div className={className}>
      <QrScanner
        onScan={handleScan}
        onError={handleError}
        // ✅ PASA MediaStreamConstraints correctas
        constraints={streamConstraints as any}
        delay={200}
        style={{ width: '100%' }}
      />
    </div>
  );
}
