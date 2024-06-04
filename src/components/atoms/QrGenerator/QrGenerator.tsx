'use client'

import React, { useState } from "react";
import QRCode from "qrcode.react";

const QrGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="qr-generator">
      <h2>Generate QR Code</h2>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter text to generate QR code"
        className="input"
      />
      {inputValue && (
        <div className="qr-code">
          <QRCode value={inputValue} />
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
