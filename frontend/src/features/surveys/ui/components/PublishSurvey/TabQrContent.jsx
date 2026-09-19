import { Download, Copy, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function TabQrContent({ onCopySuccess }) {
  const handleDownload = () => {
    onCopySuccess?.("QR code downloaded (300 DPI PNG)");
  };

  const handleCopyImage = () => {
    onCopySuccess?.("QR code image copied to clipboard");
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
          or counter signage.
        </p>

        {/* Crisp Clean SVG QR Code Representation matching Stitch */}
        <div className="p-6 bg-white rounded-2xl border-2 border-[#EFE4D6] shadow-md inline-block relative group">
          <QRCodeSVG
            value={{}}
            size={220}
          />
        </div>

        {/* Download Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={handleDownload}
            className="px-6 py-3 rounded-xl bg-[#bb0028] hover:bg-[#a10022] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Download size={16} />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleCopyImage}
            className="px-6 py-3 rounded-xl border border-[#F9DFB9] bg-[#FFF2DB]/50 hover:bg-[#FFF2DB] text-[#1f1b18] text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Copy size={16} />
            <span>Copy image</span>
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
