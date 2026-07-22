import React from 'react';

export default function Banner() {
  return (
    <div className="bg-[#FFCBA4]/75 text-[#3c2a1e] rounded-lg p-6 border border-[#F8C993] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Text Content */}
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold leading-tight text-[#3c2a1e]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Bazar Rapat Teknis Nasional
        </h2>
        <p className="text-sm font-semibold text-[#3c2a1e]/85">
          BPS Provinsi Jawa Timur
        </p>
        <p className="text-xs text-[#3c2a1e]/75 max-w-md mt-1 leading-relaxed">
          Katalog makanan khas, kue kering, dan produk UMKM binaan Dharma Wanita.
        </p>
      </div>

    </div>
  );
}
