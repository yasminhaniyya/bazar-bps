import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatRupiah } from '../../utils/formatCurrency';

/**
 * Halaman Rekapitulasi Admin
 * Menampilkan data gabungan dari order_items, orders, dan products.
 */
export default function Rekapitulasi() {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Query Join order_items dengan orders dan products menggunakan inner join
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

        // 3. Search (Pencarian Invoice, Nama Pembeli, atau Produk)
        if (searchQuery) {
          query = query.or(
            `buyer_name.ilike.%${searchQuery}%,invoice_number.ilike.%${searchQuery}%`,
            { referencedTable: 'orders' }
          );
        }

        // 4. Sorting
        query = query.order('ordered_at', { referencedTable: 'orders', ascending: sortOrder === 'asc' });

        // 5. Pagination
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

        // Summary fetch inline to avoid missing dependency warning
        let summaryQuery = supabase.from('order_items').select('quantity, subtotal, orders!inner(id)');

        const { data: sumData, error: sumError } = await summaryQuery;
        if (sumData && !sumError) {
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

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [page, sortOrder, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    window.location.href = '/admin/login';
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDF6F0]">
      {/* Latar Belakang Batik - Opacity 35% */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35]" 
        style={{ backgroundImage: "url('/batik.jpeg')", backgroundRepeat: 'repeat', backgroundSize: '400px' }}
      />
      {/* Container Konten Utama */}
      <div className="relative z-10 flex flex-col font-sans pb-24 text-[#4A3222] p-4 sm:p-8">
      
      {/* Header Banner */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Rekapitulasi Pemesanan Bazar
        </h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          Keluar Admin
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
          <h3 className="text-2xl font-bold text-gray-800">{summary.totalTx}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total Pendapatan (Paid)</p>
          <h3 className="text-2xl font-bold text-green-600">{formatRupiah(summary.totalRevenue)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Produk Terjual</p>
          <h3 className="text-2xl font-bold text-blue-600">{summary.totalProducts} Pcs</h3>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <input 
          type="text"
          placeholder="Cari Invoice, Pembeli, Produk..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Sort */}
          <select 
            className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-600 text-sm">
              <th className="p-4 font-semibold whitespace-nowrap">No</th>
              <th className="p-4 font-semibold whitespace-nowrap">Tanggal Dipesan</th>
              <th className="p-4 font-semibold whitespace-nowrap">Invoice</th>
              <th className="p-4 font-semibold whitespace-nowrap">Nama Pembeli</th>
              <th className="p-4 font-semibold whitespace-nowrap">Nama Produk</th>
              <th className="p-4 font-semibold text-right whitespace-nowrap">Harga Satuan</th>
              <th className="p-4 font-semibold text-center whitespace-nowrap">Jml</th>
              <th className="p-4 font-semibold text-right whitespace-nowrap">Total Harga</th>
              <th className="p-4 font-semibold whitespace-nowrap">Metode</th>

            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center p-8 text-gray-500">Memuat data...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="10" className="text-center p-8 text-gray-500">Tidak ada data pesanan.</td></tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
                  <td className="p-4 text-gray-500">{(page - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-4 whitespace-nowrap">{new Date(item.orders.ordered_at).toLocaleString('id-ID')}</td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{item.orders.invoice_number}</td>
                  <td className="p-4 whitespace-nowrap">{item.orders.buyer_name}</td>
                  <td className="p-4 min-w-[200px]">{item.products.name}</td>
                  <td className="p-4 text-right whitespace-nowrap">{formatRupiah(item.price)}</td>
                  <td className="p-4 text-center whitespace-nowrap">{item.quantity}</td>
                  <td className="p-4 text-right font-medium text-gray-800 whitespace-nowrap">{formatRupiah(item.subtotal)}</td>
                  <td className="p-4 whitespace-nowrap">{item.orders.payment_method}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Sebelumnya
        </button>
        <span className="text-sm text-gray-600 font-medium">Halaman {page}</span>
        <button 
          onClick={() => setPage(page + 1)}
          disabled={data.length < itemsPerPage}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Selanjutnya
        </button>
      </div>

    </div>
    </div>
  );
}
