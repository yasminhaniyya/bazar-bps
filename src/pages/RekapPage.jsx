 
export default function RekapPage({ onBackToDashboard }) {
  

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

          {/* Placeholder: data will be provided by Supabase integration */}
          <div className="p-8 text-center bg-[#FFFBF7] rounded-xl border border-[#FFCBA4]/60">
            <p className="font-bold text-sm text-[#4A3222]/90">Daftar rekap barang tidak ditampilkan di sini.</p>
            <p className="text-xs text-[#4A3222]/70 mt-2">
              Data rekap akan diisi dan dikelola oleh tim melalui integrasi Supabase.
            </p>
            <p className="text-xs text-[#4A3222]/60 mt-3">Silakan hubungi pengembang yang bertanggung jawab untuk menambahkan dan mengelola data.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
