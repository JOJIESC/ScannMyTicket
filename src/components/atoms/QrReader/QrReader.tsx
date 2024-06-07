import React, { useEffect, useState,useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

interface QrReaderComponentProps {
  className?: string;
  event_id: string | string[];
  operator_email: string;
}



const QrReaderComponent: React.FC<QrReaderComponentProps> = ({ className,event_id,operator_email }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const lastScannedTimeRef = useRef<number | null>(null); // Referencia al tiempo del último escaneo


  const handleScan = (data: any) => {
    if (data) {
      const currentTime = new Date().getTime();
      if (
        lastScannedTimeRef.current &&
        currentTime - lastScannedTimeRef.current < 2000
      ) {
        return;
      }
      lastScannedTimeRef.current = currentTime;
      setScanResult(data.text);
    }
  };
  const handleError = (err: any) => {
    console.error(err);
  };

  useEffect(() => {
    if (scanResult) {
      processQRCode();
    }
  }, [scanResult]);

  const processQRCode = async () => {
    try {
      const parsedResult = JSON.parse(scanResult || "");
      if (typeof parsedResult === 'object') {
        // Si el resultado del análisis es un objeto JSON válido, continúa con la validación
        console.log(event_id)
        console.log(operator_email)
        console.log(parsedResult.subscriber_id)
        await isQRValid(parsedResult);
      } else {
        // Si el resultado del análisis no es un objeto JSON válido, muestra un mensaje de error
        toast.error('El código QR no contiene un objeto JSON válido.');
        setScanResult(null); // Reinicia el estado del resultado del escaneo
      }
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
      toast.error('Error al procesar el código QR.');
      setScanResult(null); // Reinicia el estado del resultado del escaneo
    }
  };

  const isQRValid = async (formattedScanResult: any) => {
    try {
      /* La API RECIBE:
      {
      operator_email: email del operador,
      subscriber_id: id del suscriptor,
      subscibed_to: id del evento al que se suscribió
      }
      */
      console.log(operator_email)
      const subscriptions = await axios.post('/api/operator/checkSubscription', {email: operator_email, subscriber_id: formattedScanResult.subscriber_id, subscribed_to: event_id});
      const subscriptionsData = subscriptions.data.data;
      console.log(subscriptionsData)

      // Verificamos caducidad de la suscripción
      const expirationDate = new Date(subscriptionsData.expires_at);
      console.log(expirationDate)
      const currentDate = new Date();
      if (expirationDate < currentDate) {
        toast.error('La suscripción ha caducado');
        console.log('La suscripción ha caducado');
        setScanResult(null);
        return false;
      }

      if (subscriptions.status === 200) {
        toast.success('QR Válido');
        // Eliminamos la subscripción ya escaneada
        const deleteSubscription = await axios.post('/api/operator/deleteSubscription', {id: subscriptionsData.id});
        console.log(deleteSubscription)
        // Reiniciar el estado del resultado del escaneo después de procesar el QR
        setScanResult(null);
        return true;
      } else {
        toast.error('QR Inválido');
        setScanResult(null);
      }
    } catch (error) {
      console.error('Error al verificar el QR:', error);
      toast.error('Error al verificar el QR');
      setScanResult(null);
    }
  };

  return (
    <div className={`qr-reader ${className}`}>
      <QrScanner
        delay={500}
        onError={handleError}
        onScan={handleScan}
        className="qr-scanner w-full h-auto"
      />
      {/* {scanResult && (
        <p>{JSON.parse(scanResult).id}</p>
      )} */}
    </div>
  );
};

export default QrReaderComponent;
