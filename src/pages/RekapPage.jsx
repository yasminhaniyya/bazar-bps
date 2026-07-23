import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../utils/formatCurrency';

export default function RekapPage({ onBackToDashboard }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk Filter, Sort, Search, Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); 
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  // State Summary (Card di atas)
  const [summary, setSummary] = useState({ totalTx: 0, totalRevenue: 0, totalProducts: 0 });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          subtotal,
          orders!inner (
            id,
            ordered_at,
            invoice_number,
            buyer_name,
            payment_method,
            total_price
          ),
          products!inner (
            name
          )
        `);

      if (searchQuery) {
        query = query.or(
          `buyer_name.ilike.%${searchQuery}%,invoice_number.ilike.%${searchQuery}%`,
          { referencedTable: 'orders' }
        );
      }

      query = query.order('ordered_at', { referencedTable: 'orders', ascending: sortOrder === 'asc' });

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data: resultData, error: dbError } = await query;
      if (dbError) throw dbError;
      
      let finalData = resultData || [];
      if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          finalData = finalData.filter(item => 
              item.products.name.toLowerCase().includes(lowerQuery) ||
              item.orders.buyer_name.toLowerCase().includes(lowerQuery) ||
              item.orders.invoice_number.toLowerCase().includes(lowerQuery)
          );
      }

      setData(finalData);
      fetchSummary();

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
     let query = supabase.from('order_items').select('quantity, subtotal, orders!inner(id)');
     
     const { data: sumData, error } = await query;
     if (sumData && !error) {
        const uniqueOrders = new Set();
        let revenue = 0;
        let productsSold = 0;

        sumData.forEach(item => {
            uniqueOrders.add(item.orders.id);
            revenue += item.subtotal; 
            productsSold += item.quantity;
        });

        setSummary({
            totalTx: uniqueOrders.size, 
            totalRevenue: revenue,
            totalProducts: productsSold
        });
     }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortOrder, searchQuery]);

  return (
    <>
      <div className="fixed inset-0 bg-white z-[-2]" />
      <div 
        className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.35]" 
        style={{ backgroundImage: "url('/batik.jpeg')", backgroundRepeat: 'repeat', backgroundSize: '400px' }}
      />
      <div className="min-h-screen p-4 sm:p-8 text-[#4A3222]/80 font-['Plus_Jakarta_Sans'] relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-[#FFFBF7] hover:bg-[#FFCBA4] text-[#4A3222]/80 border border-[#FFCBA4] rounded-xl font-bold text-xs transition-colors flex items-center gap-2"
        >
          <span>←</span> Kembali ke Home Dashboard
        </button>

        {/* Rekap Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#FFCBA4] shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#FFCBA4]/60 pb-4 mb-6 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#4A3222]/90" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Rekap Barang Bazar
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#4A3222]/70 mt-1">
                Panel Rekapitulasi Data Produk - Admin BPS
              </p>
            </div>
            <span className="px-4 py-1.5 bg-[#FFCBA4] text-[#4A3222]/90 border border-[#FFCBA4] text-xs font-bold rounded-full">
              Role: Admin
            </span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              Error: {error}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#FFFBF7] p-5 rounded-xl border border-[#FFCBA4]/60">
              <p className="text-xs font-semibold text-[#4A3222]/70 mb-1">Total Transaksi</p>
              <h3 className="text-2xl font-bold text-[#4A3222]/90">{summary.totalTx}</h3>
            </div>
            <div className="bg-[#FFFBF7] p-5 rounded-xl border border-[#FFCBA4]/60">
              <p className="text-xs font-semibold text-[#4A3222]/70 mb-1">Total Pendapatan (Paid)</p>
              <h3 className="text-2xl font-bold text-[#D96A12]">{formatRupiah(summary.totalRevenue)}</h3>
            </div>
            <div className="bg-[#FFFBF7] p-5 rounded-xl border border-[#FFCBA4]/60">
              <p className="text-xs font-semibold text-[#4A3222]/70 mb-1">Produk Terjual</p>
              <h3 className="text-2xl font-bold text-[#4A3222]/90">{summary.totalProducts} Pcs</h3>
            </div>
          </div>

          {/* Filters & Controls */}
          <div className="bg-[#FFFBF7] p-4 rounded-xl border border-[#FFCBA4]/60 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <input 
              type="text"
              placeholder="Cari Invoice, Pembeli, Produk..."
              className="w-full lg:w-1/3 px-4 py-2 bg-white border border-[#FFCBA4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96A12] text-sm text-[#4A3222]"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Sort */}
              <select 
                className="w-full sm:w-auto px-4 py-2 bg-white border border-[#FFCBA4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96A12] text-sm text-[#4A3222]"
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#FFCBA4]/60 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-[#FFFBF7] border-b border-[#FFCBA4]/60 text-[#4A3222]/80 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">No</th>
                  <th className="p-4 font-bold">Tanggal</th>
                  <th className="p-4 font-bold">Invoice</th>
                  <th className="p-4 font-bold">Pembeli</th>
                  <th className="p-4 font-bold">Produk</th>
                  <th className="p-4 font-bold text-right">Harga Satuan</th>
                  <th className="p-4 font-bold text-center">Jml</th>
                  <th className="p-4 font-bold text-right">Total</th>
                  <th className="p-4 font-bold">Metode</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#4A3222]">
                {loading ? (
                  <tr><td colSpan="9" className="text-center p-8 font-medium">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="9" className="text-center p-8 font-medium">Tidak ada data pesanan.</td></tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="border-b border-[#FFCBA4]/30 hover:bg-[#FFFBF7] transition-colors">
                      <td className="p-4 font-medium opacity-70">{(page - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-4 whitespace-nowrap">{new Date(item.orders.ordered_at).toLocaleString('id-ID')}</td>
                      <td className="p-4 font-bold text-[#D96A12] whitespace-nowrap">{item.orders.invoice_number}</td>
                      <td className="p-4 whitespace-nowrap font-medium">{item.orders.buyer_name}</td>
                      <td className="p-4 min-w-[200px]">{item.products.name}</td>
                      <td className="p-4 text-right whitespace-nowrap">{formatRupiah(item.price)}</td>
                      <td className="p-4 text-center font-bold">{item.quantity}</td>
                      <td className="p-4 text-right font-bold whitespace-nowrap">{formatRupiah(item.subtotal)}</td>
                      <td className="p-4 whitespace-nowrap">{item.orders.payment_method}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-white border border-[#FFCBA4] rounded-lg text-sm font-bold text-[#4A3222] hover:bg-[#FFFBF7] disabled:opacity-50 transition-colors"
            >
              Sebelumnya
            </button>
            <span className="text-sm font-bold text-[#4A3222]/80">Halaman {page}</span>
            <button 
              onClick={() => setPage(page + 1)}
              disabled={data.length < itemsPerPage}
              className="px-4 py-2 bg-white border border-[#FFCBA4] rounded-lg text-sm font-bold text-[#4A3222] hover:bg-[#FFFBF7] disabled:opacity-50 transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
