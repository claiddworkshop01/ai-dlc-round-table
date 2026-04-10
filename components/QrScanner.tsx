"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function QrScanner({ onScan }: { onScan: (text: string) => void }) {
  const divId = "qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(divId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().catch(() => {});
        },
        undefined
      )
      .catch((err) => {
        setError("カメラへのアクセスが許可されていません: " + String(err));
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div id={divId} className="w-full max-w-sm rounded-lg overflow-hidden" />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
