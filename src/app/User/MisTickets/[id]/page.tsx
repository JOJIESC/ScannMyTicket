'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import BackButton from '@/components/atoms/BackButton/BackButton';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { http } from '@/libs/http';
import PdfTicket from '@/components/atoms/PdfTicket/PdfTicket';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type EventRow = {
  id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  start?: string | Date | null;
  end?: string | Date | null;
  startTime?: string | null;
  endTime?: string | null;
};

const PLACEHOLDER = 'https://picsum.photos/1200/600?blur=3';
const safeSrc = (src?: string | null) =>
  src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) ? src : PLACEHOLDER;

const fmt = (v?: string | Date | null) => {
  if (!v) return '—';
  const d = new Date(v as any);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
};

async function loadEvent(eventID: number) {
  const { data } = await http.get(`/api/events/${eventID}`);
  return data as EventRow;
}
async function loadSubscription(userID: number, eventID: number) {
  const { data } = await http.get(`/api/subscriptions/${userID}/${eventID}`);
  return Array.isArray(data) ? (data[0] ?? null) : data;
}
async function getProfile() {
  const { data } = await http.get('/api/auth/PROFILE');
  return data as any;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const eventId = Number(params.id);

  const [evento, setEvento] = useState<EventRow | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  const [showPdfTicket, setShowPdfTicket] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile()
      .then((p) => setProfile(p))
      .catch((err) => {
        console.error(err);
        toast.error('No se pudo cargar el perfil');
      });
  }, []);

  const userID = useMemo(() => Number(profile?.id ?? 0), [profile]);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const ev = await loadEvent(eventId);
        setEvento(ev);

        if (userID) {
          const sub = await loadSubscription(userID, eventId);
          setSubscription(sub);
        }
      } catch (e) {
        console.error(e);
        toast.error('Error al cargar los datos del ticket');
      }
    })();
  }, [eventId, userID]);

  useEffect(() => {
    if (!showPdfTicket) return;

    const downloadPDF = async () => {
      try {
        if (!pdfRef.current) return;

        const canvas = await html2canvas(pdfRef.current, {
          useCORS: true,
          scale: 2,
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const ratio = canvas.height / canvas.width;
        const targetHeight = pdfWidth * ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, targetHeight > pdfHeight ? pdfHeight : targetHeight);
        pdf.save('ticket.pdf');
      } catch (e) {
        console.error(e);
        toast.error('No se pudo generar el PDF');
      } finally {
        setShowPdfTicket(false);
      }
    };

    const t = setTimeout(downloadPDF, 350);
    return () => clearTimeout(t);
  }, [showPdfTicket]);

  const handleDownloadClick = () => setShowPdfTicket(true);

  if (!evento || !subscription) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // QR igual que tu versión funcional: serializamos la suscripción
  const qrValue = JSON.stringify(subscription);

  // ⚠️ Al mezclar ?? con || usa paréntesis:
  const attendeeName =
    subscription?.attendeeName ??
    (([profile?.first_name, profile?.last_name].filter(Boolean).join(' ')) ||
      profile?.email_address ||
      'Asistente');

  return (
    <div>
      <main className="flex justify-around w-full h-full py-28 px-20 gap-8">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-8 max-w-2xl">
          <BackButton />

          <div className="relative h-80 w-full">
            <Image
              src={safeSrc(evento.image_url)}
              alt={evento.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1024px) 100vw, 800px"
              priority={false}
            />
          </div>

          <div>
            <h3 className="font-bold text-2xl">Descripción</h3>
            <p className="text-gray-700">{evento.description || '—'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-xl">Inicio</h3>
              <p className="text-gray-700">
                {fmt(evento.start)} {evento.startTime ? `(${evento.startTime})` : ''}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl">Conclusión</h3>
              <p className="text-gray-700">
                {fmt(evento.end)} {evento.endTime ? `(${evento.endTime})` : ''}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="font-bold text-xl">Ubicación</h3>
              <p className="text-gray-700">{evento.location || '—'}</p>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col items-center gap-8 max-w-[340px]">
          <h1 className="text-4xl font-bold text-center">{evento.title}</h1>

          <div className="bg-white p-4 rounded shadow-lg">
            <QRCode value={qrValue} size={256} includeMargin />
          </div>

          <button
            onClick={handleDownloadClick}
            className="py-2 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
          >
            Descargar PDF
          </button>
        </div>
      </main>

      {/* Render oculto para generar el PDF */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {showPdfTicket && (
          <div ref={pdfRef}>
            <PdfTicket
              title={evento.title}
              id={evento.id}
              // PdfTicket pide Date y string estrictos → siempre se los damos:
              start={new Date((evento.start as any) ?? Date.now())}
              end={new Date((evento.end as any) ?? Date.now())}
              startTime={(evento.startTime ?? '') as string}
              endTime={(evento.endTime ?? '') as string}
              location={(evento.location ?? '') as string}
              image_url={safeSrc(evento.image_url)}
              attendeeName={attendeeName}
              subscription={subscription}
            />
          </div>
        )}
      </div>
    </div>
  );
}
