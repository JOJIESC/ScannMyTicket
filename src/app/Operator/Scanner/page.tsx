"use client";

import React from "react";
import QrReaderComponent from "@/components/atoms/QrReader/QrReader";
import BackButton from "@/components/atoms/BackButton/BackButton";

function Scanner() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-6 py-5 lg:px-8 gap-4">
      <header>
<BackButton />
      </header>
      <div className="qr-page">
        <h1>Scan QR Code</h1>
        <div className="qr-section">
          <QrReaderComponent />
        </div>
      </div>
    </div>
  );
}

export default Scanner;
