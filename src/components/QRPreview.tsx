import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QRStyleOptions } from '../types';
import { decorateQRCanvas } from '../utils/qrHelper';
import { Download, Clipboard, Check, RefreshCw, Smartphone } from 'lucide-react';

interface QRPreviewProps {
  text: string;
  options: QRStyleOptions;
  onClear: () => void;
  isLoading: boolean;
}

export default function QRPreview({
  text,
  options,
  onClear,
  isLoading: externalLoading
}: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (!text || !canvasRef.current) return;

    let active = true;
    const generate = async () => {
      setRendering(true);
      setRenderError(null);
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 1. Draw the basic QR Code using qrcode package
        await QRCode.toCanvas(canvas, text, {
          width: options.size,
          margin: options.margin,
          errorCorrectionLevel: options.errorCorrectionLevel,
          color: {
            dark: options.fgColor,
            light: options.bgColor,
          },
        });

        // 2. Post-process the canvas to draw logo overlays
        if (active) {
          await decorateQRCanvas(canvas, options);
        }
      } catch (err: any) {
        console.error('QR Generation failed:', err);
        if (active) {
          setRenderError(err?.message || 'Failed to render QR Code. Content may be too long for the selected error correction level.');
        }
      } finally {
        if (active) {
          setRendering(false);
        }
      }
    };

    generate();

    return () => {
      active = false;
    };
  }, [text, options]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image. Try copying it instead.');
    }
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (clipErr) {
          console.error('Clipboard write failed, trying text fallback:', clipErr);
          // Fallback: Copy raw QR text content
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy blob failed:', err);
    }
  };

  const isCurrentLoading = rendering || externalLoading;

  return (
    <div id="qr-preview-card" className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-sm flex flex-col items-center justify-between h-full min-h-[460px]">
      
      {/* Top Tag */}
      <div className="w-full flex justify-between items-center border-b border-white/10 pb-4 mb-4">
        <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-indigo-200" />
          Live QR Code Output
        </span>
        {text && (
          <span className="text-[10px] font-mono text-white/70 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
            Correction: {options.errorCorrectionLevel}
          </span>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center w-full my-4">
        {/* Loader Overlays */}
        {isCurrentLoading && (
          <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-xs flex flex-col items-center justify-center z-10 rounded-2xl">
            <RefreshCw className="w-8 h-8 text-white animate-spin mb-2" />
            <span className="text-xs font-semibold text-white/90">Generating code...</span>
          </div>
        )}

        {text ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div 
              className="p-4 rounded-2xl border border-white/15 bg-white max-w-full flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: options.bgColor }}
            >
              <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto object-contain rounded-lg animate-fade-in"
                style={{
                  width: Math.min(options.size, 280),
                  height: Math.min(options.size, 280)
                }}
              />
            </div>
            {renderError && (
              <p className="text-xs text-red-300 text-center max-w-xs">{renderError}</p>
            )}
          </div>
        ) : (
          /* Interactive Scan Line Placeholder when empty */
          <div className="relative w-64 h-64 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center bg-white/5 p-6 text-center space-y-3 overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

            {/* Dotted Mock QR blocks */}
            <div className="opacity-10 flex flex-col gap-1 w-24 h-24 mb-1">
              <div className="flex gap-1">
                <div className="w-7 h-7 border-4 border-white" />
                <div className="w-10 h-1 bg-white" />
                <div className="w-7 h-7 border-4 border-white" />
              </div>
              <div className="w-full h-1 bg-white" />
              <div className="flex gap-1">
                <div className="w-7 h-7 border-4 border-white" />
                <div className="w-16 h-4 bg-white" />
              </div>
            </div>

            {/* Laser scanning beam line */}
            <div className="absolute left-0 right-0 h-[2px] bg-white/40 shadow-md shadow-white/30 top-1/2 animate-[bounce_3s_infinite]" />

            <div className="text-xs font-semibold text-white/90 z-10">Awaiting content</div>
            <p className="text-[10px] text-white/60 max-w-[180px] z-10 leading-normal">
              Enter your information and click <strong>Generate QR Code</strong> to see the result.
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="w-full space-y-2.5 mt-4 border-t border-white/10 pt-4">
        {text ? (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-download-png"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-white/90 text-indigo-950 text-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                PNG Image
              </button>

              <button
                id="btn-copy-clipboard"
                onClick={handleCopy}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border active:scale-95 transition-all cursor-pointer
                  ${copied 
                    ? 'bg-emerald-550/25 border-emerald-400 text-emerald-300 font-bold' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Clipboard className="w-4 h-4" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <button
              id="btn-clear-preview"
              onClick={onClear}
              className="w-full py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors text-center cursor-pointer"
            >
              Clear Everything
            </button>
          </>
        ) : (
          <div className="text-center py-2 text-[11px] text-white/50">
            Generate customized codes ready for print and screen
          </div>
        )}
      </div>
    </div>
  );
}
