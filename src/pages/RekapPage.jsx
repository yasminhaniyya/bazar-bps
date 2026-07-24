import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatRupiah } from '../utils/formatCurrency';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const parseLocation = (locString) => {
  if (!locString) return '-';
  try {
    const parsed = typeof locString === 'string' ? JSON.parse(locString) : locString;
    return parsed?.name || locString;
  } catch (e) {
    return locString;
  }
};

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
            phone,
            province,
            city,
            hotel,
            room_number,
            payment_method,
            total_price,
            notes
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

  const exportToExcel = async () => {
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
            phone,
            province,
            city,
            hotel,
            room_number,
            payment_method,
            total_price,
            notes
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

      const { data: exportData, error: exportError } = await query;
      if (exportError) throw exportError;

      let finalData = exportData || [];
      if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          finalData = finalData.filter(item => 
              item.products.name.toLowerCase().includes(lowerQuery) ||
              item.orders.buyer_name.toLowerCase().includes(lowerQuery) ||
              item.orders.invoice_number.toLowerCase().includes(lowerQuery)
          );
      }

      if (finalData.length === 0) {
        alert('Tidak ada data untuk diexport');
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Rekapitulasi Bazar');

      // Define columns
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Tanggal Dipesan', key: 'tanggal', width: 20 },
        { header: 'Invoice', key: 'invoice', width: 15 },
        { header: 'Nama Pembeli', key: 'nama', width: 25 },
        { header: 'No. WA', key: 'wa', width: 15 },
        { header: 'Provinsi', key: 'provinsi', width: 20 },
        { header: 'Kab/Kota', key: 'kota', width: 20 },
        { header: 'Hotel', key: 'hotel', width: 25 },
        { header: 'No. Kamar', key: 'kamar', width: 12 },
        { header: 'Nama Produk', key: 'produk', width: 25 },
        { header: 'Harga Satuan', key: 'harga_satuan', width: 15 },
        { header: 'Jumlah', key: 'jumlah', width: 8 },
        { header: 'Total Harga', key: 'total_harga', width: 15 },
        { header: 'Metode', key: 'metode', width: 12 },
        { header: 'Catatan', key: 'catatan', width: 30 }
      ];

      // Add Data
      finalData.forEach((item, index) => {
        worksheet.addRow({
          no: index + 1,
          tanggal: new Date(item.orders.ordered_at).toLocaleString('id-ID'),
          invoice: item.orders.invoice_number,
          nama: item.orders.buyer_name,
          wa: item.orders.phone || '-',
          provinsi: parseLocation(item.orders.province),
          kota: parseLocation(item.orders.city),
          hotel: item.orders.hotel || '-',
          kamar: item.orders.room_number || '-',
          produk: item.products.name,
          harga_satuan: item.price,
          jumlah: item.quantity,
          total_harga: item.subtotal,
          metode: item.orders.payment_method,
          catatan: item.orders.notes || '-'
        });
      });

      // Styling: Borders and Alignment for all cells
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          if (rowNumber === 1) {
            // Header styling
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFCBA4' }
            };
          } else {
            cell.alignment = { vertical: 'middle' };
          }
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Rekapitulasi_Bazar_${new Date().getTime()}.xlsx`);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert('Gagal mengekspor data ke Excel');
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
            <div className="flex items-center gap-3">
              <button 
                onClick={exportToExcel}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-full transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export Excel
              </button>
              <span className="px-4 py-1.5 bg-[#FFCBA4] text-[#4A3222]/90 border border-[#FFCBA4] text-xs font-bold rounded-full">
                Role: Admin
              </span>
            </div>
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
                  <th className="p-4 font-bold">No. WA</th>
                  <th className="p-4 font-bold">Provinsi</th>
                  <th className="p-4 font-bold">Kab/Kota</th>
                  <th className="p-4 font-bold">Hotel</th>
                  <th className="p-4 font-bold">Kamar</th>
                  <th className="p-4 font-bold">Produk</th>
                  <th className="p-4 font-bold text-right">Harga Satuan</th>
                  <th className="p-4 font-bold text-center">Jml</th>
                  <th className="p-4 font-bold text-right">Total</th>
                  <th className="p-4 font-bold">Metode</th>
                  <th className="p-4 font-bold">Catatan</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#4A3222]">
                {loading ? (
                  <tr><td colSpan="15" className="text-center p-8 font-medium">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan="15" className="text-center p-8 font-medium">Tidak ada data pesanan.</td></tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="border-b border-[#FFCBA4]/30 hover:bg-[#FFFBF7] transition-colors">
                      <td className="p-4 font-medium opacity-70">{(page - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-4 whitespace-nowrap">{new Date(item.orders.ordered_at).toLocaleString('id-ID')}</td>
                      <td className="p-4 font-bold text-[#D96A12] whitespace-nowrap">{item.orders.invoice_number}</td>
                      <td className="p-4 whitespace-nowrap font-medium">{item.orders.buyer_name}</td>
                      <td className="p-4 whitespace-nowrap">{item.orders.phone || '-'}</td>
                      <td className="p-4 whitespace-nowrap">{parseLocation(item.orders.province)}</td>
                      <td className="p-4 whitespace-nowrap">{parseLocation(item.orders.city)}</td>
                      <td className="p-4 whitespace-nowrap">{item.orders.hotel || '-'}</td>
                      <td className="p-4 whitespace-nowrap">{item.orders.room_number || '-'}</td>
                      <td className="p-4 min-w-[200px]">{item.products.name}</td>
                      <td className="p-4 text-right whitespace-nowrap">{formatRupiah(item.price)}</td>
                      <td className="p-4 text-center font-bold">{item.quantity}</td>
                      <td className="p-4 text-right font-bold whitespace-nowrap">{formatRupiah(item.subtotal)}</td>
                      <td className="p-4 whitespace-nowrap">{item.orders.payment_method}</td>
                      <td className="p-4 whitespace-nowrap opacity-70">{item.orders.notes || '-'}</td>
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
