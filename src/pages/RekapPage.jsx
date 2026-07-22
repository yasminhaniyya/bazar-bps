import React from 'react';
import { products } from '../data/products';

export default function RekapPage({ onBackToDashboard }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 text-[#4A3222]/80 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-[#FFFBF7] hover:bg-[#FFCBA4] text-[#4A3222]/80 border border-[#FFCBA4] rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
        >
          <span>←</span> Kembali ke Home Dashboard
        </button>

        {/* Rekap Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#FFCBA4] shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#FFCBA4]/60 pb-4 mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-[#4A3222]/90">Rekap Barang Bazar</h1>
              <p className="text-xs font-semibold text-[#4A3222]/70 mt-0.5">
                Panel Rekapitulasi Data Produk - Admin BPS
              </p>
            </div>
            <span className="px-3 py-1 bg-[#FFCBA4] text-[#4A3222]/90 border border-[#FFCBA4] text-xs font-bold rounded-full">
              Role: Admin
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FFCBA4] text-[#4A3222]/90 font-black border-b border-[#FFCBA4]">
                  <th className="p-3 rounded-tl-xl">No</th>
                  <th className="p-3">Nama Barang</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3 text-right rounded-tr-xl">Harga (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFCBA4]/50 bg-white">
                {products.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-[#FFFBF7] transition-colors">
                    <td className="p-3 font-bold text-[#4A3222]/60">{idx + 1}</td>
                    <td className="p-3 font-extrabold text-[#4A3222]/90">{p.nama}</td>
                    <td className="p-3 text-[#4A3222]/80">{p.kategori}</td>
                    <td className="p-3 text-right font-black text-[#4A3222]/90">
                      {formatRupiah(p.harga)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
