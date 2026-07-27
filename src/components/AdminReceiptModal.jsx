import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';

export default function AdminReceiptModal({ isOpen, onClose, invoiceData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen || !invoiceData) return null;

  const handleDownloadJpg = () => {
    const receiptElement = document.getElementById('admin-receipt-card-element');
    if (!receiptElement) return;

    setIsProcessing(true);
    
    htmlToImage.toJpeg(receiptElement, { quality: 0.95, backgroundColor: '#ffffff', pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Receipt-${invoiceData.invoiceNo}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.open(dataUrl, '_blank');
      })
      .catch((err) => {
        console.error('Gagal memproses gambar struk:', err);
        alert('Gagal memproses gambar struk. Silakan coba lagi.');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FDF6F0] rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Latar Belakang Batik Modal */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.35]" 
          style={{ backgroundImage: "url('/batik.jpeg')", backgroundRepeat: 'repeat', backgroundSize: '400px' }}
        />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center">
          
          {/* Header Actions */}
          <div className="w-full flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#4A3222]">Detail Receipt</h3>
            <button 
              onClick={onClose}
              className="text-[#4A3222] hover:bg-amber-100 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Receipt Card Element (Captured by html-to-image) */}
          <div
            id="admin-receipt-card-element"
            className="w-full bg-gradient-to-b from-white to-[#FFF8F0] rounded-3xl shadow-xl border border-[#FFCBA4]/40 p-6 sm:p-8 space-y-5 text-[#4A3222] relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#FFCBA4] via-[#F29C5A] to-[#FFCBA4]"></div>

            {/* Title */}
            <div className="text-center pb-2 pt-2">
              <h2 className="font-black text-[#D97736] tracking-wide text-base sm:text-lg drop-shadow-sm">RECEIPT PEMBELIAN</h2>
            </div>

            {/* Delivered Info */}
            <div className="space-y-3.5 text-[11px] sm:text-xs">
              <div className="flex justify-between items-start leading-relaxed">
                <span className="text-slate-400 font-bold">Delivered at:</span>
                <div className="text-right text-[#4A3222] font-semibold space-y-0.5 max-w-[70%]">
                  <span className="block font-black text-sm text-[#4A3222]">{invoiceData.nama}</span>
                  <span className="block">{invoiceData.hotel}, Kamar No. {invoiceData.kamar}</span>
                  {(invoiceData.selectedCity || invoiceData.selectedProvince) && (
                    <span className="block">
                      {invoiceData.selectedCity || ''}{invoiceData.selectedCity && invoiceData.selectedProvince ? ', ' : ''}
                      {invoiceData.selectedProvince ? `Prov. ${invoiceData.selectedProvince}` : ''}
                    </span>
                  )}
                  <span className="block">Indonesia</span>
                </div>
              </div>

              {/* Waktu Order */}
              <div className="flex justify-between items-center font-semibold">
                <span className="text-slate-400 font-bold">Waktu Order:</span>
                <span className="text-[#4A3222]">{invoiceData.orderTime}</span>
              </div>
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Center Info Box */}
            <div className="bg-[#FFFBF7] rounded-2xl p-4 text-center text-xs font-black text-[#4A3222] space-y-1.5 border border-[#F29C5A]/30 shadow-3xs">
              <p className="tracking-wide text-sm text-[#D97736]">{(invoiceData.hotel || '').toUpperCase()}</p>
              <p className="font-semibold text-slate-500">{invoiceData.whatsapp}</p>
              <p className="font-semibold text-slate-500">Kamar No: {invoiceData.kamar}</p>
              {invoiceData.notes && <p className="font-semibold text-slate-500">Catatan: {invoiceData.notes}</p>}
            </div>

            {/* Ref Code */}
            <div className="text-center font-extrabold text-xs text-[#D97736] tracking-wider my-3">
              Ref. {invoiceData.invoiceNo}
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Items Table */}
            <div className="space-y-3 text-[11px] sm:text-xs">
              {invoiceData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center gap-4 text-[#4A3222] font-semibold">
                  <span className="flex-1 font-bold text-[#4A3222] text-left leading-tight">{item.nama}</span>
                  <span className="text-slate-400 font-bold min-w-8 text-center">{item.quantity}</span>
                  <span className="text-[#F29C5A] font-bold min-w-16 text-right">{(item.harga).toLocaleString('id-ID')}</span>
                  <span className="text-[#D97736] font-black min-w-20 text-right">{(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            <div className="border-t-[1.5px] border-dashed border-[#F29C5A]/60 my-2"></div>

            {/* Subtotal, Total */}
            <div className="space-y-2 text-[11px] sm:text-xs font-semibold text-slate-500">
              <div className="flex justify-between items-center gap-4">
                <span className="flex-1 text-slate-400 font-bold text-left">Subtotal</span>
                <span className="text-slate-400 font-bold min-w-8 text-center">{invoiceData.items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                <span className="min-w-16 text-right"></span>
                <span className="text-[#4A3222] font-black min-w-20 text-right">{(invoiceData.subtotal).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="flex-1 text-slate-400 font-bold text-left">Biaya Pengiriman</span>
                <span className="min-w-8 text-center"></span>
                <span className="min-w-16 text-right"></span>
                <span className="text-[#4A3222] font-bold min-w-20 text-right">0</span>
              </div>
              <div className="flex justify-between items-center gap-4 text-sm font-black text-[#4A3222] pt-1">
                <span className="flex-1 text-left">Total</span>
                <span className="min-w-8 text-center"></span>
                <span className="min-w-16 text-right"></span>
                <span className="text-base text-[#D97736] font-black min-w-20 text-right">{(invoiceData.total).toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Stamp LUNAS */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="transform rotate-[-8deg] border-4 border-double border-[#2ECC71] rounded-xl px-6 py-1.5 text-[#2ECC71] font-black tracking-[4px] text-lg bg-white select-none shadow-2xs">
                LUNAS
              </div>
            </div>
          </div>

          {/* Download Action */}
          <div className="w-full mt-6 flex justify-center">
            <button
              onClick={handleDownloadJpg}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4A3222] hover:bg-[#3d2719] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Memproses...' : (
                <>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JPG
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
