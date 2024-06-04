declare module "react-qr-scanner" {
  import * as React from "react";

  interface QrReaderProps {
    delay?: number | boolean;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    className?: string;
    facingMode?: string;
    legacyMode?: boolean;
    resolution?: number;
    showViewFinder?: boolean;
    constraints?: MediaTrackConstraints;
  }

  class QrReader extends React.Component<QrReaderProps> {}

  export default QrReader;
}
