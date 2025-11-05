'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import BackButton from '@/components/atoms/BackButton/BackButton';
import QRCode from 'qrcode.react';
import PdfTicket from '@/components/atoms/PdfTicket/PdfTicket';
import { http } from '@/libs/http';
import { Event } from '@/types';
import { toast } from 'react-toastify';

async function fetchEvent(id: number) {
  const { data } = await http.get(`/api/events/${id}`);
  return data as Event;
}
async function fetchProfile() {
  const { data } = await http.get('/api/auth/PROFILE');
  return data;
}
async function fetchSubscription(userID: number, eventID: number) {
  const { data } = await http.get(`/api/subscriptions/${userID}/${eventID}`);
  return data;
}

export default function TicketPage({ params }: { params: { id: string } }) {
  const [evento, setEvento] = useState<Event | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [showPdfTicket, setShowPdfTicket] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  // carga inicial
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [ev, prof] = await Promise.all([
          fetchEvent(Number(params.id)),
          fetchProfile(),
        ]);
        if (!alive) return;
        setEvento(ev);
        setUserID(prof.id);
      } catch {
        toast.error('Error cargando datos');
      }
    })();
    return () => { alive = false; };
  }, [params.id]);

  // cuando hay userID, trae la suscripción
  useEffect(() => {
    if (!userID) return;
    let alive = true;
    (async () => {
      try {
        const sub = await fetchSubscription(userID, Number(params.id));
        if (alive) setSubscription(sub);
      } catch {
        toast.error('No se encontró tu suscripción');
      }
    })();
    return () => { alive = false; };
  }, [userID, params.id]);

  // descarga PDF con dynamic import
  useEffect(() => {
    if (!showPdfTicket) return;
    const run = async () => {
      try {
        const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
          import('html2canvas'),
          import('jspdf'),
        ]);
        if (!pdfRef.current) return;
        const canvas = await html2canvas(pdfRef.current, { useCORS: true, scale: 2 });
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const ratio = canvas.height / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfWidth * ratio);
        pdf.save('ticket.pdf');
      } catch {
        toast.error('No se pudo generar el PDF');
      } finally {
        setShowPdfTicket(false);
      }
    };
    run();
  }, [showPdfTicket]);

  const handleDownloadClick = () => setShowPdfTicket(true);

  if (!evento || !subscription) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="w-56 h-56 border rounded-lg flex items-center justify-center">Cargando…</div>
      </div>
    );
  }

  return (
    <div>
      <main className="flex justify-around w-full h-full py-28 px-20 gap-8">
        <div className="flex flex-col gap-8">
          <BackButton />
          <Image className="h-80 w-auto rounded-lg" src={evento.image_url} alt={evento.title} width={500} height={200} />
          <div>
            <h3 className="font-bold text-2xl">Descripción:</h3>
            <p>{evento.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-2xl">Ubicación:</h3>
            <p>{evento.location}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 max-w-[340px]">
          <h1 className="text-4xl font-bold">{evento.title}</h1>
          <div className="bg-white p-4 rounded shadow-lg">
            {/* Idealmente el QR debería ser un payload mínimo/firmado, no todo el objeto */}
            <QRCode value={JSON.stringify(subscription)} size={256} />
          </div>
          <button onClick={handleDownloadClick}
            className="py-2 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
            Descargar PDF
          </button>
        </div>
      </main>

      {showPdfTicket && (
        <div ref={pdfRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
          <PdfTicket
            title={evento.title}
            id={evento.id}
            start={new Date(evento.start)}
            end={new Date(evento.end)}
            startTime={evento.startTime}
            endTime={evento.endTime}
            location={evento.location}
            image_url={evento.image_url}
            attendeeName={subscription.attendeeName}
            subscription={subscription}
          />
        </div>
      )}
    </div>
  );
}
