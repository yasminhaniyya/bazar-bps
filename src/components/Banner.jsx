import { useState } from 'react';
import AddProductModal from './AddProductModal';

export default function Banner({ isAdmin = false, onAddProduct }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#F8C993] shadow-xs">
      {/* solid color overlay (35% opacity) to match Login Admin button */}
      <div className="absolute inset-0 bg-[#FFCBA4]" style={{ opacity: 0.35 }} aria-hidden />

      <div className="relative p-6 text-[#3c2a1e] flex flex-col items-center gap-6">
        {/* Text Content */}
        <div className="space-y-2 text-center w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 justify-center">
                <img
                  src="/logo-dwp.png"
                  alt="DWP logo"
                  className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto mr-2 sm:mr-4 md:mr-6"
                  style={{ maxWidth: '6rem' }}
                />

                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold leading-tight text-[#3c2a1e] text-center sm:whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  DWP BPS PROVINSI JAWA TIMUR
                </h3>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold leading-tight text-[#3c2a1e] -mt-2 sm:-mt-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                BAZAR
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#3c2a1e]/75 mt-2 leading-relaxed max-w-prose mx-auto">
              Katalog makanan khas, kue kering, dan produk UMKM binaan Dharma Wanita.
            </p>
          </div>
        </div>
      </div>     {/* Admin action */}
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
  );
}
