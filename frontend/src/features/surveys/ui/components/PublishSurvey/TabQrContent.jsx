import React, { useState, useRef } from "react";
import { Download, Copy, Check, ShieldCheck, ExternalLink, QrCode } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

export default function TabQrContent({ url, survey, onCopySuccess }) {
  const [copiedImage, setCopiedImage] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const hiddenCanvasRef = useRef(null);

  const baseRawUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const qrValue = baseRawUrl.includes("source=")
    ? baseRawUrl
    : `${baseRawUrl}${baseRawUrl.includes("?") ? "&" : "?"}source=qr`;
  const surveyTitle = survey?.title || "Feedback Survey";

  const handleDownload = () => {
    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) {
        throw new Error("QR Canvas element not ready");
      }

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const sanitizedName = (surveyTitle || "survey")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      downloadLink.href = pngUrl;
      downloadLink.download = `${sanitizedName || "survey"}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloaded(true);
      onCopySuccess?.("QR code downloaded (300 DPI PNG)!");
      setTimeout(() => setDownloaded(false), 2200);
    } catch (err) {
      console.error("Failed to download QR code:", err);
      onCopySuccess?.("Failed to download QR code. Please try again.");
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = hiddenCanvasRef.current;
      if (!canvas) {
        throw new Error("QR Canvas element not ready");
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to generate image blob");
        }

        if (navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopiedImage(true);
            onCopySuccess?.("QR code image copied to clipboard!");
            setTimeout(() => setCopiedImage(false), 2200);
            return;
          } catch (writeErr) {
            console.warn("Direct image clipboard write failed, falling back to URL copy:", writeErr);
          }
        }

        // Fallback: Copy the survey URL if image clipboard write is unsupported or rejected
        await navigator.clipboard.writeText(qrValue);
        setCopiedImage(true);
        onCopySuccess?.("Survey link copied to clipboard (Image clipboard unsupported in this browser)");
        setTimeout(() => setCopiedImage(false), 2200);
      }, "image/png");
    } catch (err) {
      console.error("Failed to copy QR code image:", err);
      onCopySuccess?.("Failed to copy QR image. Copied survey URL instead.");
      try {
        await navigator.clipboard.writeText(qrValue);
      } catch (e) {
        console.error("Clipboard fallback failed:", e);
      }
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-[#EFE4D6] p-8 shadow-xs flex flex-col items-center text-center">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7d7461] mb-2 font-mono-tag">
          SHARE WITH A QR CODE
        </span>
        <h2 className="text-xl sm:text-2xl font-epilogue font-semibold text-[#1f1b18] max-w-md">
          Instant scanning for offline touchpoints
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7461] max-w-lg mt-2 mb-8 font-inter leading-relaxed">
          Scan or download to print on receipts, table tents, product packaging,
          or counter signage for <span className="font-semibold text-[#1f1b18]">"{surveyTitle}"</span>.
        </p>

        {/* Crisp Clean SVG QR Code Representation */}
        <div className="p-6 bg-white rounded-2xl border-2 border-[#EFE4D6] shadow-md inline-block relative group transition-transform duration-200 hover:scale-[1.02]">
          <QRCodeSVG
            value={qrValue}
            size={220}
            level="H"
            fgColor="#1f1b18"
            bgColor="#ffffff"
            includeMargin={false}
          />
        </div>

        {/* Hidden high-res canvas for 300 DPI exports and clipboard */}
        <div className="hidden" aria-hidden="true">
          <QRCodeCanvas
            ref={hiddenCanvasRef}
            value={qrValue}
            size={1024}
            level="H"
            fgColor="#1f1b18"
            bgColor="#ffffff"
            includeMargin={true}
          />
        </div>

        {/* Destination preview */}
        <div className="mt-4 flex items-center gap-2 max-w-md bg-[#FBF2EC] px-3.5 py-1.5 rounded-lg border border-[#EFE4D6] text-xs font-mono text-[#7d7461] truncate">
          <QrCode size={13} className="text-[#bb0028] shrink-0" />
          <span className="truncate">{qrValue}</span>
        </div>

        {/* Download & Copy Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
          <button
            type="button"
            onClick={handleDownload}
            className="px-6 py-3 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95"
          >
            {downloaded ? <Check size={16} /> : <Download size={16} />}
            <span>{downloaded ? "Downloaded PNG!" : "Download PNG"}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyImage}
            className="px-6 py-3 rounded-xl border border-[#F9DFB9] bg-[#FFF2DB]/50 hover:bg-[#FFF2DB] text-[#1f1b18] text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs active:scale-95"
          >
            {copiedImage ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedImage ? "Copied Image!" : "Copy image"}</span>
          </button>
        </div>

        {/* Print Specs Note */}
        <div className="mt-8 pt-6 border-t border-[#EFE4D6] flex items-center gap-2 text-xs font-inter text-[#7d7461]">
          <ShieldCheck size={16} className="text-[#bb0028]" />
          <span>
            High resolution 300 DPI vector-ready export • Scannable up to 2.5
            meters distance
          </span>
        </div>
      </div>
    </section>
  );
}

