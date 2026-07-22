import React from 'react';

export default function CheckoutPage({ cartItems = [], onBackToDashboard }) {
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.harga * item.quantity), 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 text-[#4A3222]/80 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-[#FFFBF7] hover:bg-[#FFCBA4] text-[#4A3222]/80 border border-[#FFCBA4] rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
        >
          <span>←</span> Kembali ke Dashboard
        </button>

        {/* Checkout Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#FFCBA4] shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#FFCBA4]/60 pb-4 mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#4A3222]/90">Halaman Checkout</h1>
              <p className="text-xs font-semibold text-[#4A3222]/70 mt-0.5">
                (Dikerjakan oleh Teman Tim)
              </p>
            </div>
            <span className="px-3 py-1 bg-[#FFCBA4] text-[#4A3222]/90 border border-[#FFCBA4] text-xs font-bold rounded-full">
              Tahap 17
            </span>
          </div>

          {/* Ringkasan Item */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#4A3222]/60">
              Ringkasan Pesanan:
            </h3>

            {cartItems.length > 0 ? (
              <div className="divide-y divide-[#FFCBA4]/50 bg-[#FFFBF7] rounded-xl p-4 border border-[#FFCBA4]/60 space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm pt-2 first:pt-0">
                    <div>
                      <p className="font-bold text-[#4A3222]/90">{item.nama}</p>
                      <p className="text-xs text-[#4A3222]/70">
                        {item.quantity} x {formatRupiah(item.harga)}
                      </p>
                    </div>
                    <p className="font-black text-[#4A3222]/90">
                      {formatRupiah(item.harga * item.quantity)}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-[#FFCBA4] flex justify-between items-center text-base font-black">
                  <span>Total Bayar:</span>
                  <span className="text-lg text-[#4A3222]/90">{formatRupiah(totalPrice)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs font-semibold italic text-[#4A3222]/60">Tidak ada barang yang dipilih.</p>
            )}
          </div>

          {/* Info note */}
          <div className="mt-6 p-4 bg-[#FFCBA4]/30 rounded-xl border border-[#FFCBA4] text-xs">
            <p className="font-bold text-[#4A3222]/90">Integrasi Halaman Checkout & Receipt</p>
            <p className="mt-1 text-[#4A3222]/80">
              Pengalihan dari Dashboard ke halaman ini berhasil! Selanjutnya area proses pembayaran & cetak nota (Receipt) diselesaikan oleh anggota tim Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
