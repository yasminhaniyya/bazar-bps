import React from 'react';

export default function BottomCheckout({
  cartItems = [],
  onCheckout,
  onClearCart
}) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.harga * item.quantity), 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  // Sembunyikan jika tidak ada barang dipilih
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-white border-t border-slate-200 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Info Keranjang */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FAD5A5] border border-amber-200 text-[#D96A12] flex items-center justify-center font-semibold text-sm">
            <span className="text-lg">🛒</span>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">{totalItems} barang dipilih</p>
            <p className="text-sm sm:text-base font-bold text-slate-900">
              {formatRupiah(totalPrice)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClearCart}
            className="px-3 py-1.5 text-slate-500 hover:text-rose-600 font-medium text-xs rounded transition-colors"
          >
            Hapus
          </button>
          
          <button
            onClick={onCheckout}
            className="px-4 py-2 bg-[#E67E22] hover:bg-[#D96A12] text-white font-semibold text-xs sm:text-sm rounded transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <span>Checkout</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
