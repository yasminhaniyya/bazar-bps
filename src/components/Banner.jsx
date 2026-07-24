import { useState } from 'react';
import AddProductModal from './AddProductModal';

export default function Banner({ isAdmin = false, onAddProduct }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#F8C993] shadow-xs">
      {/* banner overlay using admin button color at 40% opacity */}
      <div
        className="absolute inset-0 bg-[#D96A12]"
        style={{ opacity: 0.4 }}
        aria-hidden
      />

      <div className="relative px-4 py-3 sm:p-6 text-[#3c2a1e] flex flex-col items-center gap-2 sm:gap-4">
        {/* Text Content */}
        <div className="space-y-2 text-center w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-4 mb-1 pr-2 sm:pr-4 md:pr-6">
                <img
                  src="/logo bps.png"
                  alt="BPS logo"
                  className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
                  style={{ maxWidth: '6rem', objectFit: 'contain' }}
                />
                <img
                  src="/logo-dwp.png"
                  alt="DWP logo"
                  className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto"
                  style={{ maxWidth: '6rem', objectFit: 'contain' }}
                />
              </div>

              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-extrabold leading-tight text-[#3c2a1e] text-center sm:whitespace-nowrap mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                DWP BPS PROVINSI JAWA TIMUR
              </h3>

              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold leading-tight text-[#3c2a1e] -mt-1 sm:-mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                BAZAR
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#3c2a1e]/75 mt-2 leading-relaxed max-w-prose mx-auto">
              Katalog makanan khas, kue kering, dan produk UMKM binaan Dharma Wanita.
            </p>
          </div>
        </div>

        {/* Admin action */}
        {isAdmin && (
          <div className="flex items-center justify-center mt-1 sm:mt-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#D96A12] hover:bg-[#C95b0f] text-white font-semibold text-xs sm:text-sm rounded-full shadow-sm"
            >
              + Tambah Barang
            </button>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) => onAddProduct?.(data)}
      />
    </div>
  );
}
