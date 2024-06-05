import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import axios from 'axios';

interface EventCardProps {
  title: string;
  id: number;
  start: Date;
  end: Date;
  startTime: string;
  endTime: string;
  location: string;
  image_url: string;
  subscription: any;
  attendeeName?: string; // Agregar la propiedad attendeeName
}

const PdfTicket: React.FC<EventCardProps> = ({
  title,
  id,
  start,
  end,
  startTime,
  endTime,
  location,
  image_url,
  subscription,
  attendeeName
}) => {
  const [userAttendeeName, setUserAttendeeName] = useState<string>(attendeeName || '');

  useEffect(() => {
    if (!attendeeName) {
      const getProfile = async () => {
        try {
          const response = await axios.get('/api/auth/PROFILE');
          const user = response.data;
          setUserAttendeeName(`${user.first_name} ${user.last_name}`);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      getProfile();
    }
  }, [attendeeName]);

  const downloadPDF = async () => {
    const input = document.getElementById('ticket')!;
    const canvas = await html2canvas(input, { 
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
  };

  return (
    <div>
      <div id="ticket" className="w-[210mm] h-[297mm] p-0 bg-white flex flex-col items-center justify-center">
        <div className="w-full h-1/5 relative">
          <img src={image_url} alt="Event" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white bg-black bg-opacity-50">{title}</h1>
        </div>
        <div className="flex flex-col mt-24 items-center my-8 text-center">
          <h2 className="text-3xl font-semibold">Boleto Digital</h2>
          <div className="my-8">
            <QRCode value={JSON.stringify(subscription)} size={200} />
          </div>
          <p className="text-xl my-2">Fecha Inicio: {start.toLocaleDateString('es-ES')} {startTime}</p>
          <p className="text-xl my-2">Fecha Conclusión: {end.toLocaleDateString('es-ES')} {endTime}</p>
          <p className="text-xl my-2">Locación: {location}</p>
        </div>
        <div className="w-full h-1/5 relative mt-auto">
          <img src={image_url} alt="Event" className="w-full h-full object-cover" crossOrigin="anonymous" />
          <p className="absolute inset-0 flex items-center justify-center text-center font-bold text-white bg-black bg-opacity-50 py-4 text-3xl">{userAttendeeName}</p>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button onClick={downloadPDF} className="py-2 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default PdfTicket;
