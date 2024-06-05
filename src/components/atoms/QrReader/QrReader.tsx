"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

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

  return (
    <div className={`qr-reader ${className}`}>
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        className="qr-scanner w-full h-auto"
      />
      {scanResult && <p className="text-center mt-4">Scanned Result: {scanResult}</p>}
    </div>
  );
};

export default QrReaderComponent;