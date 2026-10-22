
"use client";

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, CameraOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const QR_SCANNER_ELEMENT_ID = "qr-code-reader";

export default function QrScannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let scanner: Html5QrcodeScanner | null = null;
    try {
        scanner = new Html5QrcodeScanner(
        QR_SCANNER_ELEMENT_ID,
        {
            qrbox: { width: 250, height: 250 },
            fps: 10,
            rememberLastUsedCamera: true,
        },
        false
        );

        const onScanSuccess = (decodedText: string) => {
            if (scanner) {
                scanner.clear();
            }
            setScanResult(decodedText);
            toast({
                title: "QR Code Scanned!",
                description: `Content: ${decodedText}`,
                action: (
                <div className="p-2 bg-green-500 text-white rounded-full">
                    <CheckCircle className="h-5 w-5" />
                </div>
                )
            });
            router.push(`/search?q=${encodeURIComponent(decodedText)}`);
        };

        const onScanFailure = (error: any) => {};
        
        scanner.render(onScanSuccess, onScanFailure)
        .catch(err => {
            console.error("QR Scanner render error:", err);
            setCameraError("Could not start camera. Please grant camera permissions in your browser settings and refresh the page.");
        });

    } catch(e) {
      console.error("Failed to initialize Html5QrcodeScanner", e);
      setCameraError("QR Scanner failed to load. The scanner container might not be ready.");
    }

    return () => {
      if (scanner && scanner.getState() !== 1) {
         scanner.clear().catch(error => {
            console.error("Failed to clear html5QrcodeScanner.", error);
         });
      }
    };
  }, [router, toast]);


  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <header className="text-center mb-12">
        <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline text-primary">QR Code Scanner</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Point your camera at a QR code to get product details.
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Scan a Product QR Code</CardTitle>
          <CardDescription>
            Center the QR code within the box below. The scan will happen automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cameraError && (
             <Alert variant="destructive">
              <CameraOff className="h-4 w-4" />
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription>
                {cameraError} <br/> If you've already granted permissions, please ensure no other application is using your camera.
              </AlertDescription>
            </Alert>
          )}
          <div id={QR_SCANNER_ELEMENT_ID} className="w-full rounded-md border" />
          {scanResult && (
             <Alert className="mt-4 border-green-500">
               <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-600">Scan Successful!</AlertTitle>
              <AlertDescription>
                Redirecting you to the search results for: <strong>{scanResult}</strong>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-8 text-sm text-muted-foreground">
        <p>This feature requires camera access. We do not store any images or videos.</p>
        <p>Go back to <Link href="/" className="text-primary hover:underline">Homepage</Link>.</p>
      </div>
    </div>
  );
}
