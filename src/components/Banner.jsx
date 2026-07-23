import { useState } from 'react';
import AddProductModal from './AddProductModal';

export default function Banner({ isAdmin = false, onAddProduct }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#F8C993] shadow-xs">
      {/* background image (low opacity) */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url('/banner-pattern.png')`, opacity: 0.45 }}
        aria-hidden
      />
      {/* soft color overlay to preserve accent (reduced for readability) */}
      <div className="absolute inset-0 bg-[#FFCBA4]" style={{ opacity: 0.12 }} aria-hidden />

      <div className="relative p-6 text-[#3c2a1e] flex flex-col sm:flex-row items-center justify-between gap-6">
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

      {/* Admin action */}
      {isAdmin && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-1.5 bg-[#D96A12] hover:bg-[#C95b0f] text-white font-semibold rounded-full shadow-sm"
          >
            + Tambah Barang
          </button>
        </div>
      )}

      <AddProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => onAddProduct?.(data)}
      />
    </div>
  </div>
  );
}
