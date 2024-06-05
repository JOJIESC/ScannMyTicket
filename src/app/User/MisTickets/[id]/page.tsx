'use client'

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { Event } from '@/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '@/components/atoms/BackButton/BackButton';
import QRCode from 'qrcode.react';
import PdfTicket from '@/components/atoms/PdfTicket/PdfTicket';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function loadEvent(eventID: number) {
  const { data } = await axios.get(`/api/events/${eventID}`);
  return data;
}

async function loadSubscription(userID: number, eventID: number) {
  const { data } = await axios.get(`/api/subscriptions/${userID}/${eventID}`);
  return data;
}

const getProfile = async () => {
  const response = await axios.get('/api/auth/PROFILE');
  return response;
};

function EventPage({ params }: { params: any }) {
  const [evento, setEvento] = useState<Event | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [userID, setUserID] = useState<number | null>(null);
  const [showPdfTicket, setShowPdfTicket] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile()
      .then((response) => {
        setUserID(response.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await loadEvent(params.id);
        setEvento(eventData);

        if (userID) {
          const subscriptionData = await loadSubscription(userID, params.id);
          setSubscription(subscriptionData);
        }
      } catch (error) {
        toast.error('Error al cargar los datos');
      }
    };

    fetchData();
  }, [params.id, userID]);

  useEffect(() => {
    if (showPdfTicket) {
      setTimeout(() => {
        const downloadPDF = async () => {
          if (pdfRef.current) {
            const canvas = await html2canvas(pdfRef.current, { 
              useCORS: true,
              scale: 2 // Aumenta la escala para mejorar la calidad
            });
            const imgData = canvas.toDataURL('image/png', 1.0); // Ajusta la calidad de la imagen
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasHeight / canvasWidth;
            const pdfCanvasHeight = pdfWidth * ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfCanvasHeight);
            pdf.save("ticket.pdf");
          }
        };

        downloadPDF();
        setShowPdfTicket(false);
      }, 1000); // Esperar 1 segundo antes de iniciar la descarga del PDF
    }
  }, [showPdfTicket]);

  const handleDownloadClick = () => {
    setShowPdfTicket(true);
  };

  if (!evento || !subscription) {
    return (
      <div className="flex justify-center items-center h-dvh w-full">
        <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="flex justify-around w-full h-full py-28 px-20 gap-8">
        <div className="flex flex-col gap-8">
          <BackButton />
          <Image
            className="h-80 w-auto rounded-lg"
            src={evento.image_url}
            alt={evento.title}
            width={500}
            height={200}
          />
          <div>
            <h3 className="font-bold text-2xl">Descripción: </h3>
            <p>{evento.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-2xl">Ubicación: </h3>
            <p>{evento.location}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 max-w-[340px]">
          <div>
            <h1 className="text-4xl font-bold">{evento.title}</h1>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <QRCode value={JSON.stringify(subscription)} size={256} />
            </div>
          </div>
          <button onClick={handleDownloadClick} className="py-2 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
          Descargar PDF
        </button>
        </div>
      </main>
      <div className="flex justify-center mt-10">
        
      </div>
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

export default EventPage;
