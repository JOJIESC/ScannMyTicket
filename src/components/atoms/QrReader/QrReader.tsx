"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Import dynamically to ensure it's only loaded on the client-side
const QrScanner = dynamic(() => import("react-qr-scanner"), { ssr: false });

const QrReaderComponent: React.FC = () => {
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
    <div className="qr-reader">
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        className="qr-scanner"
      />
      {scanResult && <p>Scanned Result: {scanResult}</p>}
    </div>
  );
};

export default QrReaderComponent;
