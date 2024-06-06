import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import axios from "axios";

const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

interface QrReaderComponentProps {
  className?: string;
}

const QrReaderComponent: React.FC<QrReaderComponentProps> = ({ className }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleScan = (data: any) => {
    if (data) {
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
      const subscriptions = await axios.post('/api/operator/checkSubscription', { id: formattedScanResult.id });
      if (subscriptions.status === 200) {
        toast.success('QR Válido');
        // Reiniciar el estado del resultado del escaneo después de procesar el QR
        setScanResult(null);
        return true;
      } else {
        toast.error('QR Inválido');
      }
    } catch (error) {
      console.error('Error al verificar el QR:', error);
      toast.error('Error al verificar el QR');
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
